import { Component, inject } from '@angular/core';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { CampaignCreatorComponent } from './campaign-dialog.component';
import { MatButton } from '@angular/material/button';
import { InfluencerSelectorComponent } from './influencer-selector.component';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatIcon,
    MatLabel,
    MatHint,
    CampaignCreatorComponent,
    InfluencerSelectorComponent,
    MatButton,
  ],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss'
})
export class CampaignsComponent {

}
