import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';

type NavItem = {
  label: string;
  path: string;
  icon: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterOutlet,
    MatButton,
    MatDatepicker,
    MatFormField,
    MatInput,
    MatLabel,
    MatHint,
    MatDatepickerInput,
    MatDrawerContainer,
    MatDrawer,
    MatNavList,
    RouterLinkActive,
    RouterLink,
    MatListItem,
    MatIcon,
    MatToolbar,
    MatIconButton,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  navItems: NavItem[] = [
    {
      label: 'Campaigns',
      path: 'campaigns',
      icon: 'campaign',
    },
    {
      label: 'Influencers',
      path: 'influencers',
      icon: 'person',
    },
  ];
}
