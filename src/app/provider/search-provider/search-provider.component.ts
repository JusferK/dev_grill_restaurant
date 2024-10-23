import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IProvider } from '../../models/provider.model';
import { ReactiveFormsModule } from '@angular/forms';
import { ProviderService } from '../../services/provider-api.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpErrorResponse } from '@angular/common/http';
import { FloatLabelModule } from 'primeng/floatlabel';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-search-provider',
  standalone: true,
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    TagModule,
    RatingModule,
    CommonModule,
    FloatLabelModule,
    KeyFilterModule,
    DatePipe
  ],
  templateUrl: './search-provider.component.html',
  styleUrl: './search-provider.component.css',
  providers: [
    MessageService
  ]
})
export class SearchProviderComponent {

  expandedRows = {};
  providerFound = signal<IProvider[]>([]);
  isSearching = signal<boolean>(false);
  searchForProvider: FormGroup;
  infoBusy = computed(() => this.providerFound().length === 0);
  private _fb = inject(FormBuilder);
  private _providerApiService = inject(ProviderService);
  private _messageService = inject(MessageService);

  constructor() {
    this.searchForProvider = this._fb.group({
      nit: ['', [Validators.required]],
      name: ['', [Validators.required]]
    })
  }

  onSearchProvider(): void {
    this.providerFound.set([]);
    this._providerApiService.getProvider(this.searchForProvider.value).subscribe({
      next: (provider_returned: IProvider) => {
        this.providerFound.set([provider_returned]);
      }, error: (error: HttpErrorResponse) => {
        error.status === 302 ? (
          this._messageService.add({ severity: 'error', summary: 'Not found', detail: 'Provider was not found', life: 2000 })
        ) : (
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Try again later', life: 2000 })
        )
      }
    })
  }

  reset(): void {
    this.searchForProvider.reset();
    this.providerFound.set([]);
  }

}
