import 'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js';
import {
  Config
} from './firebase.js';
import {
  initializeApp
} from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js';
import {
  getDatabase, ref as dbref,
  child, onValue, get
} from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js';

const ref = `Anime Gallery`;

const app = await initializeApp(Config);
const database = await getDatabase(app);
const database_ref = await dbref(database, `${ref}/`);


export default class Task {
  static async GetData(box) {
    onValue(database_ref, async(snap)=> {
      
      if (snap.exists()) {
        
        console.log(snap.val());        
        snap.forEach((SnapChild) => {
          const key = SnapChild.key;
          const value = SnapChild.val();
          
          Task.SectionForm(box, value.Title, key);
        });
      } else {
        
        console.log('No data available');
      }
    }, async(error)=> console.log(error));
  }
  static SectionForm(container, title, url) {
    container.innerHTML = 
      `
        <a class="section_title" href="gallery.html#/${url}">
          <span>
            ${title}
          </span>
        </a>
      `
    + container.innerHTML;
  }
  static GetSectionUrl() {
    const WindowUrl = window.location.href.split("/");
    const PostUrl = WindowUrl.slice(-1).pop();
    
    return PostUrl;
  }
  static GetSectionData(box) {
    const database_child = child(database_ref, Task.GetSectionUrl());
    
    get(database_child).then(async(snap)=> {
      if(snap.exists()) {
        const SectionKey = snap.key;
        const SectionContent = snap.val();
        
        console.log(SectionContent);
        
        Task.GalleryForm(box, SectionContent.Title, SectionContent.Links, SectionKey)
      } else {
        
        console.log('No data available');
      }
    });
  }
  static GalleryForm(container, title, images, SectionKey) {
    const section = Task.GalleryContent(images, SectionKey);
    
    const h3 = document.createElement('h3');
    h3.textContent = title;
    
    container.append(h3, section);
  }
  static GalleryContent(images, SectionKey) {
    const ImagesContainer = document.createElement('section');
    ImagesContainer.classList.add('grid');
    
    const arr = [];
    for(const[ImageKey, ImageUrl] of Object.entries(images)) {
      const obj = {
        key: ImageKey,
        url: ImageUrl.url
      }
      
      arr.push(obj);
    }
    arr.forEach((e)=> {
      
      ImagesContainer.innerHTML =
        `
          <div x-data="{ open: false }" class="main_box">
            <button
              class="expand_btn"
              x-on:click="open = ! open"
            >
              <i class="fas fa-expand"></i>
            </button>
            <div class="ot">
              <img class="main_img" src="${e.url}" loading="eager" />
            </div>
            <div class="box" x-show="open" @click.outside="open = false">
              <button class="close" @click="open = ! open">
                <i class="fas fa-times"></i>
              </button>
              <img class="img" src="${e.url}" loading="eager" />
            </div>
          </div>
        `
      + ImagesContainer.innerHTML;
    });
    return ImagesContainer;
  }
  static SearchFilter() {
    var input, filter, container, box, a, i, txtValue;
    
    input = document.getElementById("inp_search");
    filter = input.value.toUpperCase();
    
    container = document.getElementById("container");
    box = container.getElementsByClassName("section_title");
    
    for (i = 0; i < box.length; i++) {
      
      a = box[i].getElementsByTagName("span")[0];
      txtValue = a.textContent || a.innerText;
      
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          box[i].style.display = "";
      } else {
          box[i].style.display = "none";
      }
      
    }
  }
}