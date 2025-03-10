import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavParams } from '@ionic/angular';
import { filter } from 'rxjs';
import { User } from 'src/app/interfaces/User';
import { pageProductType } from 'src/app/interfaces/pageType';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { PFilterPage } from '../Services/p-filter/p-filter.page';
interface Product {
  brand: string;
  category: string;
  description: string;
  discount: string;
  image: string;
  model: string;
  name: string;
  price: string;
  product_id: string;
  quantity: string;
  specialprice: string|null;
}
interface Product2{
  name: string;
  categories: string|string[];
  price: string;
  p_id: string;
  images: string;
  off: string | null;
  originalPrice: string | null;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  USER:User

  FILTERS:string[]|string="";
  PRICE:{lower:string|number ,upper :string|number}|string="";
  SORT:string="";
  OPTIONS:string|string[]="";


  pageType:string;
  Loading:boolean=true
  lastCreated_Id:string="0";
  paramsGot: any;
  imgUrl2: string;
  Products:Product2[]=[];

  constructor(
    private authService: AuthServiceService,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private router: Router
  ) { 
    // Fetch the page type from the route
    this.pageType = this.activatedRoute.snapshot.paramMap.get('type')!;
  
    // Merge queryParams and state parameters, falling back to defaults if necessary
    const stateParams = this.router.getCurrentNavigation()?.extras.state || {};
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.paramsGot = { ...queryParams, ...stateParams };
      
      // Ensure cate_id exists; fallback to default_id if missing
      if (!this.paramsGot.cate_id) {
        console.warn("cate_id is missing! Falling back to 'default_id'");
        this.paramsGot.cate_id = 'default_id';
      }
  
      console.log('Resolved paramsGot:', this.paramsGot);
    });
  
    // Fetch user data and image URL
    this.USER = JSON.parse(localStorage.getItem('userData')!);
    this.imgUrl2 = this.authService.img2();
  }
  
  ngOnInit() {
    // Call the getType method after parameters are resolved
    this.getType();
  }
  

  getType()
  {
    let type=pageProductType;
    this.Loading=true;
    if(this.pageType == type.special)
    {
      this.getLatestProductList();
    }else if(this.pageType == type.featured)
    {
      this.getFeaturedProductList();
    }else if(this.pageType == type.shop_by_category)
    {
      this.getProductsByCategory();
    }
  }
  // CATEGORY PRODUCTS
  async getProductsByCategory() {
    if (!this.paramsGot?.cate_id) {
      console.error('cate_id is missing or paramsGot is invalid.');
      return;
    }
  
    let param = {
      userData: {
        cate_id: this.paramsGot.cate_id,
        ...this.USER.userData,
        soort: this.SORT || '',
        filters: this.FILTERS || '',
        options: this.OPTIONS || '',
        price: this.PRICE || '',
        lastCreated: this.lastCreated_Id,
      },
    };
  
    try {
      const result: any = await this.authService.postData(param, 'categoryProducts');
      if (result.categoryProducts?.length > 0) {
        this.Products = this.DataTransformToDisplay(result.categoryProducts);
      }
      console.log(this.Products);
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      this.Loading = false;
    }
  }
  
  
  // LATEST PRODUCTS
  async getLatestProductList()
  {
   
    
    let param ={
      // product: this.paramsGot,
      lastCreated: this.lastCreated_Id
  }
   await this.authService.postData(param, "specialProductList").then((result:any) =>{
      if(result.special.length > 0){
       this.Products =   this.DataTransformToDisplay(result.special);
      }
console.log(this.Products)
    }).catch((error)=>{console.error(error)}).finally(()=>{
      this.Loading=false;
    })
  }
  
  // FEATURED PRODUCTS
  async getFeaturedProductList()
  {
    if(this.paramsGot?.hasOwnProperty('featured_id'))
    {
      console.log("testing");
      let param ={
        product: this.paramsGot.featured_id,
        lastCreated: this.lastCreated_Id
      }
      console.log('API Request Parameters:', param);

     await this.authService.postData(param, "featuredproductsList").then((result:any) =>{
      console.log('Full API Response:', result);

        if(result.featuredproducts.length > 0){
          const dataLength = result.featuredproducts.length - 1;
          this.lastCreated_Id =result.featuredproducts[dataLength].product_id;
         this.Products =   this.DataTransformToDisplay(result.featuredproducts);
        }
  console.log(this.Products)
      }).catch((error)=>{console.error(error)}).finally(()=>{
        this.Loading=false;
      })
    }else{
      console.error("something went wrong!.Did not get the required data");
    }
    
   
  }
  // TRANSFORM THE DATA FROM API INTO THE VIEW STRUCTURED
  DataTransformToDisplay(data:Product[]):Product2[]{
    if(data.length > 0)
    {
      var prop:Product2[]= [];
      for(let pro of data )
      {
        let price;
        let oririnalPrice;
        let off ;
        let pri;
        let oriprice
        if(pro.specialprice != null){
          price=null;
          oririnalPrice=null;
          off=null;
          pri=null;
          oriprice=null;
          price=pro.specialprice;
          oririnalPrice=pro.price;
          pri=(JSON.parse(price)).toFixed(2);
          oriprice=(JSON.parse(oririnalPrice)).toFixed(2);
          // off=(100-((JSON.parse(pri)/JSON.parse(oriprice))*100)).toFixed(0);
          off=(100-((pri/oriprice)*100)).toFixed(0);
          
    
         }else{
          price=null;
          oririnalPrice=null;
          pri=null;
          oriprice=null;
          off=null;
          price=pro.price;
         }
             let proc =  {
                           name: pro.name,
                           categories: pro.category,
                           price: price,
                           p_id: pro.product_id,
                           images:this.imgUrl2+pro.image,
                           off: off,
                          originalPrice: oririnalPrice
                         }
             prop.push(proc);        
           
      }
      return prop;
    }else{
      return [];
    }
   
  }
  // SORT PRODUCTS
  async presentSort() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sort By',
      cssClass:'custom-sort-actionSheet',
      buttons: [
        
        {
          text: 'Price : Low to High',
          role:     this.SORT == 'asc' ? 'selected' :"",
          handler:()=>{
            this.SORT = 'asc';
            this.getType();
            // this.adoptionListParams.locationSort = 'true';
            // this.adoptionListParams.ageSort = '';
            // this.adoptionListParams.newSort = '';
            // this.loadAdoptionList();
          }
        },
        {
          text: 'Price : High to Low',
          role:     this.SORT == 'desc' ? 'selected' :"",
          handler:()=>{
            this.SORT = 'desc';
            this.getType();
            // this.adoptionListParams.newSort = 'true';
            // this.adoptionListParams.ageSort = '';
            // this.adoptionListParams.locationSort = '';
            // this.loadAdoptionList();
          }
          // data: {
          //   action: 'share',
          // },
        }
       
      ],
    });
  
    await actionSheet.present();
  }

  // FILTER PRODUCTS
  async openFilterPage() {

    if (this.paramsGot && this.paramsGot.hasOwnProperty('cate_id') && this.paramsGot.cate_id) {
      console.log('cate_id:', this.paramsGot.cate_id);
    } else {
      console.error('cate_id is undefined or paramsGot does not contain cate_id.');
      console.log('paramsGot:', this.paramsGot);
    }
    

    const modal = await this.modalCtrl.create({
      component:PFilterPage,
      componentProps:{
        category_id : this.paramsGot.cate_id,
        page:pageProductType.shop_by_category
      }
    });
    modal.present();
  
    const { data, role } = await modal.onWillDismiss();
  
    if (role === 'confirm') {
    let a: {
      price: {
          lower: number;
          upper: number;
      };
      filters: string[];
      options: string[];
  } = data
      // console.log(data)
    this.FILTERS = a.filters;
    this.OPTIONS = a.options;
    this.PRICE = a.price;
    this.getType();
      // this.adoptionListParams.animalTypeName=data.animalTypeName;
      // this.adoptionListParams.breed=data.breed;
      // this.adoptionListParams.color=data.color;
      // this.adoptionListParams.gender=data.gender;
      // this.loadAdoptionList();
     
    }
  }

}
