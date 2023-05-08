import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { CountriesService } from 'src/app/countries/services/countries.service';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [],
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input()
  public initialValue: string = '';

  private debouncer: Subject<string> = new Subject<string>();

  private debouncerSuscription?: Subscription;

  @Input()
  public placeholder: string = '';

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();

  constructor(private countriesService: CountriesService) {

  }

  ngOnInit(): void {
    this. debouncerSuscription = this.debouncer
    .pipe(debounceTime(300)).subscribe((value) => {
      this.onDebounce.emit(value);
    });


  }



  ngOnDestroy(): void {
    this.debouncerSuscription?.unsubscribe();
  }

  searchByTerm(value: string): void {
    if (!value) return;
    this.onValue.emit(value);
  }

  onKeyPress(searchTerm: string): void {
    this.debouncer.next(searchTerm);
  }
}
