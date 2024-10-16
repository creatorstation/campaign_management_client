import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CampaignsComponent } from './home/campaigns/campaigns.component';
import { InfluencersComponent } from './home/influencers/influencers.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: 'campaigns', component: CampaignsComponent },
      { path: 'influencers', component: InfluencersComponent }
    ],
  },
  {
    path: '**', redirectTo: '',
  }
];
