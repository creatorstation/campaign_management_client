import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { InfluencerSelectorComponent } from './influencer-selector.component';
import { InfluencerTableComponent } from './influencer-table.component';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CampaignSummaryComponent } from './campaign-summary.component';

interface ContentType {
  name: string;
  platform: string;
}

@Component({
  selector: 'app-campaign-creator-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatIconModule, MatCheckboxModule,
    MatStepperModule, InfluencerSelectorComponent, InfluencerTableComponent, CampaignSummaryComponent,
  ],
  template: `
    <mat-stepper #stepper (selectionChange)="$event.selectedIndex === 2 ? whenOnControlPage() : whenOnSummaryPage()">
      <mat-step [stepControl]="campaignForm">
        <ng-template matStepLabel>Kampanya</ng-template>
        <div class="campaign-creator">
          <h1>Yeni Kampanya Ekle</h1>
          <form [formGroup]="campaignForm">
            <mat-form-field appearance="outline">
              <mat-label>Marka</mat-label>
              <input matInput formControlName="brand" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Kampanya Adı</mat-label>
              <input matInput formControlName="name" required maxlength="250">
              <mat-hint align="end">{{ campaignForm.get('name')?.value!.length || 0 }}/250</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Brief</mat-label>
              <textarea matInput formControlName="brief" rows="4"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>URL</mat-label>
              <input matInput formControlName="url" required>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Başlangıç Tarihi</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="start_date" required>
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline" class="number-input">
                <mat-label>Ödeme Vadesi (Gün)</mat-label>
                <input matInput type="number" formControlName="payment_terms" required>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Platformlar</mat-label>
              <mat-select formControlName="platforms" multiple required (selectionChange)="onPlatformsChange()">
                <mat-option *ngFor="let platform of platforms" [value]="platform">{{ platform }}</mat-option>
              </mat-select>
            </mat-form-field>

            <div formArrayName="contentTypes" *ngIf="campaignForm.get('platforms')?.value?.length > 0"
                 class="content-types">
              <h3>İçerik Türleri</h3>
              <div *ngFor="let platform of campaignForm.get('platforms')?.value; trackBy: trackByPlatform">
                <div class="platform-section">
                  <h4>{{ platform }}</h4>
                  <div *ngFor="let contentType of getContentTypesForPlatform(platform); trackBy: trackByContentType">
                    <div class="content-type-item" [formGroupName]="getContentTypeIndex(platform, contentType.name)">
                      <mat-checkbox formControlName="selected">
                        {{ contentType.name }}
                      </mat-checkbox>
                      <mat-form-field appearance="outline" class="number-input"
                                      *ngIf="getContentTypeFormGroup(platform, contentType.name).get('selected')?.value">
                        <mat-label>Sayı</mat-label>
                        <input matInput type="number" formControlName="count" min="1">
                      </mat-form-field>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button mat-stroked-button matStepperNext color="primary" type="submit" [disabled]="!campaignForm.valid">
              Sonraki
            </button>
          </form>
        </div>
      </mat-step>
      <mat-step>
        <ng-template matStepLabel>Influencer</ng-template>
        <div class="influencer-selector-container">
          <app-influencer-selector #influencerSelectorComponent/>
          <div class="button-container">
            <button mat-stroked-button matStepperNext color="primary" type="submit"
                    [disabled]="influencerSelectorComponent.selectedInfluencers.length === 0">
              Sonraki
            </button>
          </div>
        </div>
      </mat-step>
      <mat-step>
        <ng-template matStepLabel>Kontrol</ng-template>
        <app-influencer-table #influencerTableComponent/>
      </mat-step>
      <mat-step>
        <ng-template matStepLabel>Ozet</ng-template>
        <app-campaign-summary
          [campaignData]="{
            brand: campaignForm.get('brand')?.value,
            name: campaignForm.get('name')?.value,
            brief: campaignForm.get('brief')?.value,
            url: campaignForm.get('url')?.value,
            start_date: campaignForm.get('start_date')?.value,
            paymentTerm: campaignForm.get('payment_terms')?.value,
            contentTypes: campaignForm.get('contentTypes')?.value,
          }"
          #campaignSummaryComponent/>
      </mat-step>
    </mat-stepper>
  `,
  styles: [`
    .campaign-creator {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    mat-form-field {
      max-width: 100%;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .content-types {
      margin-top: 16px;
      max-height: 400px;
      overflow-y: auto;
    }

    .platform-section {
      margin-bottom: 16px;
    }

    .platform-section h4 {
      margin-bottom: 8px;
      font-weight: bold;
    }

    .content-type-item {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    button {
      align-self: flex-end;
      padding: 8px 16px;
    }

    .influencer-selector-container {
      display: flex;
      flex-direction: column;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .number-input {
      width: 100px;
    }
  `],
})
export class CampaignCreatorComponent implements OnInit {
  campaignForm: FormGroup;
  contentTypes: ContentType[] = [];
  platforms: string[] = [];

  @ViewChild('influencerSelectorComponent') selectorComponent!: InfluencerSelectorComponent;
  @ViewChild('influencerTableComponent') tableComponent!: InfluencerTableComponent;
  @ViewChild('campaignSummaryComponent') summaryComponent!: CampaignSummaryComponent;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    const now = new Date();
    now.setMonth(9);
    now.setDate(11);

    this.campaignForm = this.fb.group({
      brand: ['Siemens', Validators.required],
      name: ['Siemens Kahve Makinasi Black Friday', [Validators.required, Validators.maxLength(250)]],
      brief: ['Akilli kahve hazirlama, farkli icecek secenekleri ve kullanici dostu arayuz'],
      url: ['https://www.bosch-home.com.tr/urun-listesi/elektrikli-supurgeler/sarjli-dikey-supurgeler/unlimited/unlimited10', Validators.required],
      start_date: [now, Validators.required],
      payment_terms: [60, [Validators.required, Validators.min(1)]],
      platforms: [[], Validators.required],
      contentTypes: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.fetchServices().subscribe();
    firstValueFrom(this.fetchServices()).then(services => {
      this.contentTypes = services;
      this.platforms = [...new Set(this.contentTypes.map(ct => ct.platform))];
      this.initializeContentTypes();
    });
  }

  fetchServices() {
    return this.http.get<ContentType[]>('https://plantingathomas.app.n8n.cloud/webhook/services');
  }

  initializeContentTypes() {
    const contentTypesArray = this.campaignForm.get('contentTypes') as FormArray;
    this.contentTypes.forEach(ct => {
      contentTypesArray.push(this.fb.group({
        platform: ct.platform,
        name: ct.name,
        selected: false,
        count: 0,
      }));
    });
  }

  onPlatformsChange() {
    const selectedPlatforms = this.campaignForm.get('platforms')?.value as string[];
    const contentTypesArray = this.campaignForm.get('contentTypes') as FormArray;

    contentTypesArray.controls.forEach((control, index) => {
      const isSelected = selectedPlatforms.includes(control.get('platform')?.value);
      if (isSelected) {
        control.enable();
      } else {
        control.disable();
        control.patchValue({ selected: false, count: 0 });
      }
    });
  }

  getContentTypesForPlatform(platform: string): ContentType[] {
    return this.contentTypes.filter(ct => ct.platform === platform);
  }

  getContentTypeIndex(platform: string, name: string): number {
    return this.contentTypes.findIndex(ct => ct.platform === platform && ct.name === name);
  }

  getContentTypeFormGroup(platform: string, name: string): FormGroup {
    const index = this.getContentTypeIndex(platform, name);
    return (this.campaignForm.get('contentTypes') as FormArray).at(index) as FormGroup;
  }

  trackByPlatform(index: number, platform: string): string {
    return platform;
  }

  trackByContentType(index: number, contentType: ContentType): string {
    return `${contentType.platform}-${contentType.name}`;
  }

  whenOnControlPage() {
    const sample = this.campaignForm.value.contentTypes.filter((x: any) => x.selected);

    console.log({ sample });

    const usernames = this.selectorComponent.selectedInfluencers.map(a => a.username).join(',');
    this.tableComponent.fetchInfluencers(usernames);
  }

  whenOnSummaryPage() {
    firstValueFrom(this.http.get('https://plantingathomas.app.n8n.cloud/webhook/influencers', {
      params: {
        usernames: this.selectorComponent.selectedInfluencers.map(a => a.username).join(','),
      },
    })).then((res: any) => {
      this.summaryComponent.influencers = res;
    });
  }
}
