import {ChangeDetectorRef, Component, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

    @ViewChild('sidenav') sidenav: MatSidenav;
    mobileQuery: MediaQueryList;
    mobileQueryListener: () => void;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 959px)');
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        if (!this.mobileQuery.matches) {
            this.sidenav.close().then();
        }
    }
}
