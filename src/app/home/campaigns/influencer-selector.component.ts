import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface Influencer {
  full_name: string;
  username: string;
}

@Component({
  selector: 'app-influencer-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
  ],
  template: `
    <div class="influencer-selector">
      <h1>Influencer Seçimi</h1>
      <form [formGroup]="influencerForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Influencer Ara</mat-label>
          <input type="text"
                 matInput
                 formControlName="influencerInput"
                 [matAutocomplete]="auto">
          <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onInfluencerSelected($event)">
            @for (influencer of filteredInfluencers(); track $index) {
              <mat-option [value]="influencer">
                {{ influencer.full_name }} (&#64;{{ influencer.username }})
              </mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>
      </form>

      <div class="selected-influencers">
        <h2>Seçilen Influencerlar</h2>
        <mat-chip-set>
          @for (influencer of selectedInfluencers; track $index) {
            <mat-chip (removed)="removeInfluencer(influencer)">
              {{ influencer.full_name }} (&#64;{{ influencer.username }})
              <button matChipRemove>
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip>
          }
        </mat-chip-set>
      </div>
    </div>
  `,
  styles: [`
    .influencer-selector {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;

      h1 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .full-width {
        width: 100%;
      }

      .selected-influencers {
        margin-top: 20px;

        h2 {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        mat-chip-set {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      }
    }
  `],
})
export class InfluencerSelectorComponent implements OnInit {
  influencerForm: FormGroup;
  influencers: Influencer[] = [];
  filteredInfluencers!: () => Influencer[];
  selectedInfluencers: Influencer[] = [];

  private http = inject(HttpClient);

  constructor(private fb: FormBuilder) {
    firstValueFrom(this.http.get<Influencer[]>('https://plantingathomas.app.n8n.cloud/webhook/influencers'))
      .then((res) => {
        this.influencers = res;
      })

    this.influencerForm = this.fb.group({
      influencerInput: [''],
    });
  }

  ngOnInit() {
    this.filteredInfluencers = () => {
      const filterValue = this.influencerForm.get('influencerInput')!.value?.toLowerCase() || '';
      return this.influencers.filter(influencer =>
        influencer.full_name.toLowerCase().includes(filterValue) ||
        influencer.username.toLowerCase().includes(filterValue),
      );
    };
  }

  onInfluencerSelected(event: any) {
    const selectedInfluencer = event.option.value;
    if (!this.selectedInfluencers.some(i => i.username === selectedInfluencer.username)) {
      this.selectedInfluencers.push(selectedInfluencer);
    }
    this.influencerForm.get('influencerInput')!.setValue('');
  }

  removeInfluencer(influencer: Influencer) {
    const index = this.selectedInfluencers.indexOf(influencer);
    if (index >= 0) {
      this.selectedInfluencers.splice(index, 1);
    }
  }
}
