import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { DogsInterface } from 'src/app/interfaces/dogs.interface';
import { DogsService } from 'src/app/services/dogSearch.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-dog-search',
  templateUrl: './dog-search.component.html',
  styleUrls: ['./dog-search.component.scss']
})
export class DogSearchComponent {

  public dogs: DogsInterface[] = [];
  public breeds: SelectItem[] = [];
  public selectedBreed: string | undefined;
  public ids: string[] = [];
  public maxAge: number | undefined = undefined;
  public minAge: number | undefined = undefined;
  public sort: string = "breed:asc";
  public sortOptions: any[] = [{label: 'Asc', value: 'breed:asc'}, {label: 'Desc', value: 'breed:desc'}];
  public next: string | undefined;
  public prev: string | undefined;
  public favorites: string[] = [];

  constructor(
    private dogsService: DogsService,
    private messageService: MessageService,
    private loginService: LoginService,
    private router: Router
    ){}

  ngOnInit(){
      this.dogsService.getBreeds().subscribe({
        next: (data) =>{
          for (let breed of data){
            const breedsAux: SelectItem = { label: breed, value: breed }
            this.breeds.push(breedsAux);
          }
        },
        error: (err) =>{
          console.log(err)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Can not connect to endpoint.' });
        }
      })
      this.clearFilter()
  }

  logOut() {
    localStorage.removeItem('cookie')
    this.loginService.logOut().subscribe()
    this.router.navigate(["/login"])
  }

  search() {
      const query = this.mapQuery()
      this.dogsService.searchDogs(query).subscribe( data => {
        console.log(data)
        this.next = data.next
        this.ids = data.resultIds
        this.dogsService.getDogs(data.resultIds).subscribe(data => {
          console.log(data)
          this.dogs = data
        })
      })
  }

  mapQuery(){
    const query: any = {
      breeds: this.selectedBreed,
      ageMax: this.maxAge,
      ageMin: this.minAge,
      sort: this.sort
    }
    const cleanData = JSON.parse(JSON.stringify(query))
    return cleanData
  }

  nextPagination(){
    if (this.next != undefined){
      this.dogsService.searchPagination(this.next).subscribe(data => {
        this.next = data?.next
        this.prev = data?.prev
        this.dogsService.getDogs(data.resultIds).subscribe(data => {
          this.dogs = data
        })
      })
    }

  }

  prevPagination(){
    if (this.prev != undefined){
      this.dogsService.searchPagination(this.prev).subscribe(data => {
        this.next = data?.next || undefined
        this.prev = data?.prev || undefined
        this.dogsService.getDogs(data.resultIds).subscribe(data => {
          this.dogs = data
        })
      })
    }
  }

  storePet(id: string, name: string ){
    if(id != undefined){
      this.favorites.push(id)
      this.messageService.add({ severity: 'success', summary: 'Success', detail: name+' has been added successfully to your favorites' });
    }
  }

  clearFilter(){
    this.selectedBreed = undefined
    this.maxAge = undefined
    this.minAge = undefined
    this.sort = "breed:asc"
    const query = this.mapQuery()
    this.search()
  }

  match(){
    if(this.favorites.length > 0){
      this.dogsService.matchDog(this.favorites).subscribe(data =>{

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have been Matched!!! the dog is: '+data.match });
      })
    }
    else
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You have not dogs added in your favorites list.' });
  }



}
