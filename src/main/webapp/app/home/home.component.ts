import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { HomeService } from './home.service';
import { TraitementsService } from 'app/entities/traitements/service/traitements.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  words: any;
  recherche!: string;
  resultats: any;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private traitementService: TraitementsService,
    private homeService: HomeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.traitementService.query().subscribe((res) => {
    //   this.resultats = JSON.stringify(res);
    // });
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  searchMinicon(query: string): void {
    this.words = query.split(' ');
    const data = new FormData();
    data.append(this.words[0], this.words[1]);

    this.homeService.searchwithMinicon(data).subscribe(res => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(res.response));
      /*this.resultats = JSON.stringify(res.response);*/
      this.resultats = res.response;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
