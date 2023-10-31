import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  public loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private loginService: LoginService,
    private router: Router,
  ){}

  ngOnInit(){
    this.buildForm()
  }

  private buildForm(){
    this.loginForm = this.fb.group({
      name: [null, [Validators.required]],
      email:   [null, [Validators.required, Validators.email]]
    })
  }

  isFieldInGroupInvalid( field: string ) {
    return this.loginForm.get(field)?.invalid && this.loginForm.get(field)?.touched;
  }

  public getFieldFromGroup(field: string): FormControl {
    return this.loginForm.get(field) as FormControl;
  }

  login() {
    if (this.loginForm.invalid){
      this.messageService.add({ severity: 'error', summary: 'Incomplete Data', detail: 'Please introduce both name and email.' });
    }else{
      this.loginService.verifyLogin(this.loginForm.value).subscribe({
          next:(res) => {
            console.log(res)
          },
          error: (err) => {
            if (err.status == 200){
              console.log(err)
              localStorage.setItem("cookie","isAllowed")
              this.router.navigate(["/search"])
            }
          }
        }
      )
    }
  }

}
