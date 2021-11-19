import Task from './Task.js';

const box = document.getElementById('container');
const section_data = document.getElementById('section_data');
const searchBar = document.getElementById('inp_search');


window.onload = ()=> {
  switch(Task.GetSectionUrl()) {
    case '':
        window.location.assign('index.html');
      break;
    case 'index.html':
        Task.GetData(box);
        console.log(Task.GetSectionUrl());
        
        searchBar.addEventListener('keyup', ()=> {
          Task.SearchFilter();
        });
      break;
    case 'gallery.html':
        window.location.assign('index.html');
      break;
    default:
      Task.GetSectionData(section_data)
      console.log(Task.GetSectionUrl());
  }
}

window.Task = Task;