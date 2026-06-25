import { Component, inject, computed } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../services/language-service';

interface BreadcrumbLabel {
  sr: string;
  en: string;
}

interface BreadcrumbRaw {
  label: BreadcrumbLabel;
  url: string;
}

export interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class Breadcrumb {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
   languageService = inject(LanguageService);

  private rawBreadcrumbs = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.buildBreadcrumbs(this.activatedRoute.snapshot.root))
    ),
    { initialValue: this.buildBreadcrumbs(this.activatedRoute.snapshot.root) }
  );

  breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const lang = this.languageService.current;
    return this.rawBreadcrumbs().map((b) => ({
      label: b.label[lang],
      url: b.url,
    }));
  });

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: BreadcrumbRaw[] = []
  ): BreadcrumbRaw[] {
    for (const child of route.children) {
      const routeUrl = child.url.map((s) => s.path).join('/');
      const fullUrl = routeUrl !== '' ? `${url}/${routeUrl}` : url;

      const label = child.data['breadcrumb'] as BreadcrumbLabel | undefined;
      if (label) {
        breadcrumbs.push({ label, url: fullUrl });
      }

      this.buildBreadcrumbs(child, fullUrl, breadcrumbs);
    }

    return breadcrumbs;
  }
}