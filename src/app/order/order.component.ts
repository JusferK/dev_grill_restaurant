import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderApiService } from '../services/order-api.service';
import { IOrderRequest, Status } from '../models/order-request.model';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe, TitleCasePipe, NgIf, NgForOf, NgStyle } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { IMenu } from '../models/menu.model';
import { MenuApiService } from '../services/menu-api.service';
import { IMenuOrderList } from '../models/menu-order-list.model';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
import { ConfirmationDialogComponent } from '../menu/new-menu/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderPendingServiceService } from '../services/order-pending-service.service';
import { Subscription } from 'rxjs';

interface menuOrderJoin {
  menu_id: number;
  menu_name: string;
  menu_price: number;
  menu_photo: string;
  quantity_per_menu: number;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    MatExpansionModule,
    MatIconModule,
    TitleCasePipe,
    NgForOf,
    TableModule,
    TagModule,
    ToastModule,
    CommonModule,
    RippleModule,
    ReactiveFormsModule,
    DropdownModule,
    NgStyle
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
  providers: [MessageService]
})

export class OrderComponent implements OnInit{

  expandedRows: { [key: string]: boolean } = {};
  isLoading = signal<boolean>(true);
  isFetching = signal<boolean>(true);
  notFound = signal<boolean>(false);
  returnedError = signal<boolean>(false);
  isSearching = signal<boolean>(false);
  menuIsLoading = signal<boolean>(true);
  orderRequests = signal<IOrderRequest[]>([]);
  orderSearched = signal<IOrderRequest[]>([]);
  menuFetched = signal<menuOrderJoin[]>([]);
  statusDisabledUpdate: Status[] = [
    Status.Cancelled,
    Status.Completed
  ];
  updateRowController = signal<boolean[]>([]);
  isBusy = computed(() => {
    return this.updateRowController().includes(true);
  });
  searchOrderForm: FormGroup;
  updateOrderForm: FormGroup;
  orderUpdateSuscription?: Subscription;
  private _orderApiService = inject(OrderApiService);
  private _pendingOrders = inject(OrderPendingServiceService);
  private _menuApiService = inject(MenuApiService);
  private _dialog = inject(MatDialog);
  private _messageService = inject(MessageService);
  
  constructor(private fb: FormBuilder) {
    this.searchOrderForm = this.fb.group({
      parameter: ['', [Validators.required]]
    })

    this.updateOrderForm = this.fb.group({
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this._orderApiService.getAllOrderRequests().subscribe({
      next: (data: IOrderRequest[]) => {

        this.orderRequests.set(data);

        data.forEach((item: IOrderRequest) => {
          this.updateRowController.update((prev) => [...prev, false]);

          let counter = 0;

          if(item.status !== Status.Completed && item.status !== Status.Cancelled) {
            counter++;
            if(counter > this._pendingOrders.ordersPending()) {
              this._pendingOrders.ordersPending.set(counter);
            }
          }
        });

        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.returnedError.set(true);        
      }
    })


  }

  getSeverity(status: Status) {
    switch (status) {
        case Status.Completed:
          return 'success';
        case Status.Progress:
          return undefined;
        case Status.Pending:
          return 'warning';
        case Status.Cancelled:
          return 'danger';
    }
  }

  
  onSearchOrder(): void {
    this.isSearching.set(true);
    this.searchOrderForm.get('parameter')?.disable();
    
    const value: string | number = this.searchOrderForm.get('parameter')?.value;
    
    this._orderApiService.getOrderByParameter(value).subscribe({
      next: (data: IOrderRequest) => {
        this.orderSearched.update((prev) => [...prev, data]);
        this.isFetching.set(false);
      },
      error: () => {
        this.isFetching.set(false);
        this.notFound.set(true);
      }
    })
  }

  onReset(): void {
    this.isSearching.set(false);
    if(this.notFound()) this.notFound.set(false);
    this.searchOrderForm.get('parameter')?.enable();
    this.searchOrderForm.reset();
    this.orderSearched.set([]);
  }

  onRowExpand(event: TableRowExpandEvent) {
    
    if(this.menuFetched().length !== 0) {
      this.menuFetched.set([]);
    }

    this.expandedRows = {};
    this.expandedRows[event.data.idOrderRequest] = true;


    const list = event.data.menuOrderList as IMenuOrderList[];

    if(list) {
      list.forEach(item => {
        this._menuApiService.getMenu(item.menuIdMenu).subscribe({
          next: (data: IMenu) => {

            if(data.idMenu) {
              const specialBody: menuOrderJoin = {
                menu_id: data.idMenu,
                menu_name: data.name,
                menu_price: data.price,
                menu_photo: data.photo,
                quantity_per_menu: item.quantity
              }

              this.menuFetched.update((prev) => {
                return [...prev, specialBody];
              });

              this.menuIsLoading.set(false);
            }
          } 
        })
      });
    }
  }
  
  onRowCollapse(event: TableRowCollapseEvent) {
    this.menuIsLoading.set(true);
    this.menuFetched.set([]);
    delete this.expandedRows[event.data.idOrderRequest];
  }

  onUpdate(index: number) {
    this.updateRowController()[index] = true;
    this.updateRowController.set([...this.updateRowController()]);
  }

  onCancelUpdate(index: number) {
    this.updateRowController()[index] = false;
    this.updateRowController.set([...this.updateRowController()]);
    this.updateOrderForm.reset();
  }

  onSubmitUpdate(order: IOrderRequest, index: number, type?: string) {

    this._dialog.open(ConfirmationDialogComponent, {
      data: {
        menuInfo: null,
        showLoad: true
      },
      disableClose: true
    });

    if(this.updateOrderForm.get('status')?.value === Status.Completed || this.updateOrderForm.get('status')?.value === Status.Cancelled) {
      this._pendingOrders.ordersPending.update((prev) => prev - 1);
    }

    order.status = this.updateOrderForm.get('status')?.value;
    order.lastStatusUpdate = new Date();

    this.orderUpdateSuscription = this._orderApiService.updateOrder(order).subscribe({
      next: (data: IOrderRequest) => {

        if(type) {
          this.orderSearched.set([data]);

          this.orderRequests().forEach((item: IOrderRequest, i: number) => {
            if(item.idOrderRequest === data.idOrderRequest) {
              this.orderRequests()[i] = data;
              this.orderRequests.set([...this.orderRequests()]);
            }
          });
        } else {
          this.orderRequests()[index] = data;
          this.orderRequests.set([...this.orderRequests()]);
        }

        this.updateRowController()[index] = false;
        this.updateRowController.set([...this.updateRowController()]);
        this.updateOrderForm.reset();
        this._dialog.closeAll();
        this._messageService.add({severity: 'success', summary: 'Success', detail: 'Order has been updated'})
      }
    });

  }

  selectListOption(status: Status): SelectItem[] {
    if(status === Status.Pending) {
      const items: SelectItem[] = [{label: Status.Progress, value: Status.Progress}, {label: Status.Cancelled, value: Status.Cancelled}];
      return items;
    } else {
      const items: SelectItem[] = [{label: Status.Completed, value: Status.Completed}, {label: Status.Cancelled, value: Status.Cancelled}];
      return items;
    }
  }
}