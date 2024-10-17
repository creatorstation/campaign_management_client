import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface Influencer {
  full_name: string;
  email: string;
  followers: number;
  categories: string;
  username: string;
}

@Component({
  selector: 'app-influencer-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="influencer-contacts-container">
      <h1>Influencer Bilgileri</h1>
      <div class="table-container">
        <table mat-table [dataSource]="influencers">
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
              <div class="email-cell">
                @if (editingUsername === influencer.id) {
                  <form [formGroup]="emailForm" (ngSubmit)="handleSave(influencer.username)" class="email-edit-form">
                    <mat-form-field appearance="outline">
                      <input matInput formControlName="email">
                    </mat-form-field>
                    <button mat-icon-button type="submit" [disabled]="emailForm.invalid">
                      <mat-icon>save</mat-icon>
                    </button>
                  </form>
                } @else {
                  {{ influencer.custom_email ?? influencer?.emails?.replaceAll(' ', ',') ?? influencer.email }}
                }
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let influencer">
              @if (editingUsername === influencer.id) {
                <button mat-icon-button (click)="handleCancel()">
                  <mat-icon>close</mat-icon>
                </button>
              } @else {
                <button mat-icon-button (click)="handleEdit(influencer.id)">
                  <mat-icon>edit</mat-icon>
                </button>
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .influencer-contacts-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 1rem;
    }

    .table-container {
      flex: 1;
      overflow-x: auto;
      overflow-y: auto;
    }

    table {
      width: 100%;
      min-width: 800px;
    }

    .mat-mdc-header-row {
      background-color: #f5f5f5;
    }

    .mat-mdc-row:nth-child(even) {
      background-color: #fafafa;
    }

    .mat-mdc-row:hover {
      background-color: #f0f0f0;
    }

    .mat-mdc-cell, .mat-mdc-header-cell {
      padding: 12px;
    }

    .email-cell {
      display: flex;
      align-items: center;
      min-height: 48px;
    }

    .email-edit-form {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .mat-column-email {
      min-width: 200px;
    }

    .mat-mdc-form-field {
      width: 100%;
      margin-bottom: -1.25em;
    }
  `],
})
export class InfluencerTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'followers', 'categories', 'email', 'actions'];

  influencers: Influencer[] = [];
  editingUsername: string | null = null;
  emailForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  fetchInfluencers(usernames: string) {
    if (usernames === '') {
      return;
    }

    firstValueFrom(this.http.get<Influencer[]>('https://auto.creatorstation.com/webhook/influencers', {
      params: { usernames },
    })).then(r => {
      this.influencers = r;
    });
  }

  ngOnInit() {
  }

  handleEdit(username: string) {
    this.editingUsername = username;
    const influencer = this.influencers.find(inf => inf.username === username);
    if (influencer) {
      this.emailForm.patchValue({ email: influencer.email });
    }
  }

  handleSave(username: string) {
    if (this.emailForm.valid) {
      const oldEmail = this.influencers.find(inf => inf.username === username)?.email;
      const newEmail = this.emailForm.get('email')?.value;

      this.influencers = this.influencers.map(inf =>
        inf.username === username ? { ...inf, email: newEmail } : inf,
      );
      this.editingUsername = null;

      if (oldEmail !== newEmail) {
        firstValueFrom(this.http.patch('https://auto.creatorstation.com/webhook/influencers', {
          username,
          custom_email: newEmail,
        }));
      }

      this.emailForm.reset();
    }
  }

  handleCancel() {
    this.editingUsername = null;
    this.emailForm.reset();
  }
}
