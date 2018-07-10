import '../assets/css/styles.css';
import * as $ from 'jquery';
import { Book, Route } from "../models/";


let books : Book[];
var routes: Route[];
routes = [
    {
        "path": "/",
        "component": "list.html",
        "controller": function(){
            $.getJSON('./data/books.json').done(function(response){
                let items = response.items;
                var ract = new Ractive({
                    el: "#books",
                    template: "#templateBooks",
                    data: {items: items}
                });                                
                
            });
        }

    },
    {
        "path": "/detail/:id",
        "component": "detail.html",
        "controller": function(id){
            $.getJSON('./data/books.json').done(function(response){
                let items = response.items;
                let item = items.find(function(elem){
                    return elem.id == id;
                });

                var ract = new Ractive({
                    el: "#book",
                    template: "#templateBook",
                    data: item.volumeInfo
                });
                
            });
        }
    }
];


$(document).ready(function(){
    $('.toggle-sidebar').click(function(event){
        event.preventDefault();
        if(!$('.left-aside').hasClass('aside-close')){
            $('.left-aside').toggleClass('aside-close');            
            $('.left-aside').animate({
                width: '50px'
            }, function(){
                $('.main-section').toggleClass('main-collape');
            });
        }else {
            $('.main-section').toggleClass('main-collape');
            $('.left-aside').animate({
                width: '300px'
            }, function(){                
                $(this).toggleClass('aside-close');               
            });
        }        
    });
    
    $(window).on('load', function(e){
        let loc = e.originalEvent.target['location'];
        router(loc);
    });

    $(window).on('hashchange', function(e){
        let event = e.originalEvent;
        console.log(event);
        router(event.target['location']);                
    });
});

function router(ltn){
    let loc = ltn;
    let hash = loc.hash.split("#")[1];

    routes.map(function(data){
        let url = loc.hash.slice(1) || '/';
        let parts = url.substr(1).split('/'), param;
        

        if(url == "/" && data.path == "/"){
            getContent("./components/" + data.component, data.controller);
        }else if(data.path.match(/:id/g)){                        
            let mod = data.path.split("/:id")[0].slice(1);                        
            while(parts.length){
                if(parts.shift() === mod) {
                    param = parts.shift();
                    getContent("./components/" + data.component, data.controller, param);
                }else {
                    parts.shift();
                }
            }            
            
        }else {
            let mod = data.path.slice(1);     
            while(parts.length){
                if(parts.shift() === mod) {                    
                    getContent("./components/" + data.component, data.controller);
                }else {
                    parts.shift();
                }
            }  
        }
    });
}

function getContent(url, callback, param?){
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'text',
        success: function(response){
            $("#content").html(response);
            if(param != undefined){
                callback(param);
            }else {
                callback();
            }
        },
        error: function(error){
            console.log(error);
        },
        complete: function(xhr, status){
            console.log(status);
        }
    });
}