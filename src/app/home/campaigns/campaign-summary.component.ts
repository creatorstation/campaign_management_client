import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  username: string;
  selectedEmail?: string;
}

@Component({
  selector: 'app-campaign-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTableModule, MatSelectModule, MatButtonModule],
  template: `
    <div class="campaign-summary">
      <h2>Kampanya Özeti</h2>
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
            <mat-card-title>Kampanya Adi</mat-card-title>
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
            <mat-card-title>Baslama Tarihi</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ campaignData.start_date | date:'yyyy-MM-dd' }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Ödeme vadesi</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ campaignData.paymentTerm }}</p>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Kapsam</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @for (s of getScope(); track s) {
              <p>{{s.count}} {{s.platform}} {{s.name}}</p>
            }
          </mat-card-content>
        </mat-card>
      </div>

      <h2>Secilen Influencerlar</h2>
      <table mat-table [dataSource]="influencers" class="mat-elevation-z8">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Isim</th>
          <td mat-cell *matCellDef="let influencer">{{ influencer.full_name }}</td>
        </ng-container>

        <ng-container matColumnDef="followers">
          <th mat-header-cell *matHeaderCellDef>Takipci</th>
          <td mat-cell *matCellDef="let influencer">{{ influencer.followers | number }}</td>
        </ng-container>

        <ng-container matColumnDef="categories">
          <th mat-header-cell *matHeaderCellDef>Kategori</th>
          <td mat-cell *matCellDef="let influencer">{{ influencer.category }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let influencer">
            <mat-select [(ngModel)]="influencer.selectedEmail">
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
  `],
})
export class CampaignSummaryComponent {
  @Input() campaignData: any;
  @Input() influencers: Influencer[] = [];

  displayedColumns: string[] = ['name', 'followers', 'categories', 'email'];

  constructor() {
    if (this.influencers.length === 0) {
      this.influencers = [];
    }
  }

  getScope() {
    return this.campaignData.contentTypes.filter((x: any) => x.selected && x.count !== 0);
  }

  infEmails(influencer: Influencer): string[] {
    const emails = [];

    emails.push(influencer?.custom_email);

    const bioEmails = influencer?.emails?.split(' ');
    if (bioEmails) {
      emails.push(...bioEmails);
    }

    emails.push(influencer?.email);

    const val = Array.from(new Set(emails)).filter(Boolean);

    if (influencer.selectedEmail == null) {
      influencer.selectedEmail = val[0];
    }

    return val;
  }
}
