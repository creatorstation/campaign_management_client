import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

interface Influencer {
  emails: string;
  custom_email: string;
  name: string;
  followers: number;
  categories: string;
  email: string;
}

@Component({
  selector: 'app-campaign-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatSelectModule, MatButtonModule],
  template: `
    <div class="campaign-summary">
      <h2>Campaign Summary</h2>
      <div class="summary-grid">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Brand</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ campaignData.brand }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Campaign Name</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ campaignData.name }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Brief</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ campaignData.brief }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>URL</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ campaignData.url }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Start Date</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ campaignData.start_date | date:'yyyy-MM-dd' }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Payment Term</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Net {{ campaignData.paymentTerm }}</p>
          </mat-card-content>
        </mat-card>
      </div>

      <h2>Selected Influencers</h2>
      <table mat-table [dataSource]="influencers" class="mat-elevation-z8">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let influencer">{{ influencer.full_name }}</td>
        </ng-container>

        <ng-container matColumnDef="followers">
          <th mat-header-cell *matHeaderCellDef>Followers</th>
          <td mat-cell *matCellDef="let influencer">{{ influencer.followers | number }}</td>
        </ng-container>

        <ng-container matColumnDef="categories">
          <th mat-header-cell *matHeaderCellDef>Categories</th>
          <td mat-cell *matCellDef="let influencer">{{ influencer.category }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let influencer">
            <mat-select placeholder="Select email">
              @for (email of infEmails(influencer); track email) {
                <mat-option [value]="email">
                  {{ email }}
                </mat-option>
              }
            </mat-select>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div class="button-container">
        <button mat-raised-button color="primary">Kaydet</button>
      </div>
    </div>
  `,
  styles: [`
    .campaign-summary {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    mat-card {
      height: 100%;
    }
    table {
      width: 100%;
      margin-bottom: 30px;
    }
    .button-container {
      display: flex;
      justify-content: flex-end;
    }
    h2 {
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: bold;
    }
  `]
})
export class CampaignSummaryComponent {
  @Input() campaignData: any;
  @Input() influencers: Influencer[] = [];

  displayedColumns: string[] = ['name', 'followers', 'categories', 'email'];

  constructor() {
    // Initialize with sample data if not provided
    if (!this.campaignData) {
      this.campaignData = {
        brand: 'TechGadget',
        name: 'Summer Tech Fest',
        brief: 'Promote our latest gadgets for the summer season',
        url: 'https://techgadget.com/summer-fest',
        startDate: new Date('2023-06-01'),
        paymentTerm: 30
      };
    }

    console.log("Influencers",this.influencers);

    if (this.influencers.length === 0) {
      this.influencers = [];
    }
  }

  infEmails(influencer: Influencer): string[] {
    const emails = [influencer.custom_email, ...influencer.emails.split(' '), influencer.email].filter(Boolean);

    return Array.from(new Set(emails));
  }
}
