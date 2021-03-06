"use strict"
class widget_engine {
	constructor() { if (window.jQuery) {        
        // truncate.js
        !function(e){var t=/(\s*\S+|\s)jQuery/,n=/^(\S*)/;e.truncate=function(t,n){return e("<div></div>").append(t).truncate(n).html()},e.fn.truncate=function(r){e.isNumeric(r)&&(r={length:r});var i=e.extend({},e.truncate.defaults,r);return this.each(function(){var r=e(this);i.noBreaks&&r.find("br").replaceWith(" ");var s=r.text(),l=s.length-i.length;if(i.stripTags&&r.text(s),i.words&&l>0){var a=s.slice(0,i.length).replace(t,"").length;l=i.keepFirstWord&&0===a?s.length-n.exec(s)[0].length-1:s.length-a-1}l<0||!l&&!i.truncated||e.each(r.contents().get().reverse(),function(t,n){var r=e(n),s=r.text().length;return s<=l?(i.truncated=!0,l-=s,void r.remove()):3===n.nodeType?(i.finishBlock?e(n.splitText(s)).replaceWith(i.ellipsis):e(n.splitText(s-l-1)).replaceWith(i.ellipsis),!1):(r.truncate(e.extend(i,{length:s-l})),!1)})})},e.truncate.defaults={stripTags:!1,words:!1,keepFirstWord:!1,noBreaks:!1,finishBlock:!1,length:1/0,ellipsis:"…"}}(jQuery);
        this.keys = {blogger:""};
        this.settings = [];
    }};    
    init(){
        for(let s in this.settings){ 
            if(jQuery(this.settings[s].config.target).length){
                this.request(this.settings[s]);
            }
        }
    };
    query(){ let params = new URLSearchParams(window.location.search); if(params.has('q')){return params.get('q');}else if(params.has('s')){return params.get('s');}else{return "";} };
    label(){let e="/search/label/";if(-1!=location.href.indexOf(e))return-1!=location.href.indexOf("?updated-max")?location.href.substring(location.href.indexOf(e)+e.length,location.href.indexOf("?updated-max")):-1!=location.href.indexOf("?&max")?location.href.substring(location.href.indexOf(e)+e.length,location.href.indexOf("?&max")):-1!=location.href.indexOf("?max-results")?location.href.substring(location.href.indexOf(e)+e.length,location.href.indexOf("?max-results")):location.href.substring(location.href.indexOf(e)+e.length,location.href.length)};       
    hide_title(selector){ if( jQuery(selector).length ){ jQuery(selector).hide() } }//hide blogger widget title, 
    client(config){
        let url = config.url; 
        if(config.url.match(/wp-json\/wp\/v2\/posts\?per_page=1/)){
            url = url + widget_client.page.wordpress();
        }else
        if(config.url.match(/www.googleapis.com\/blogger\/v3/)){
            url = url + widget_client.page.blogger(config.header.title);
        }else
        if(config.url.match(/www.googleapis.com\/youtube\/v3/)){
            url = url + widget_client.page.blogger(config.header.title);
        }
        jQuery(config.target).html("").hide();
        if(config.search && !config.search.q){return}
        jQuery.ajax({ type: "GET", url:url, data: config.search })
        .done(function (data) { config.render(data,config); })
        .fail(function (xhr, textStatus, errorThrown) {
            console.log(xhr.responseText);
            console.log(textStatus);
        }); 
    }
    request(settings){
        // hasClasses
        jQuery.fn.extend({hasClasses:function(s){for(var n in s)if(jQuery(this).hasClass(s[n]))return!0;return!1}});            
        if( ! Object.keys(settings.display).includes(window.location.host) ) { return; }
        if(typeof(pageType) !== 'undefined'){             
            if( settings.display[window.location.host].includes(pageType) ){ 
                new Promise(function(resolve, reject) { resolve( settings.client(settings.config) ); });            
            }
        }else
        if( jQuery("body").hasClasses( settings.display[window.location.host] ) ){
            new Promise(function(resolve, reject) { resolve( settings.client(settings.config) ); });
        }
    };    
    wp_render(data,config){
        let truncate_func=function(t){return"undefined"!==jQuery.truncate&&(t.str=jQuery.truncate(t.str,{length:t.length?t.length:150,finishBlock:!0,ellipsis:t.url?" <a href='"+t.url+"' target='_blank' title='more'>[...]</a>":""})),t.str};    
        let title = "";
        let href = "";
        let id ="";
        let attachments = function(data){            
            href = "";
            if( typeof data._links["wp:featuredmedia"] !== "undefined" && data._links["wp:featuredmedia"][0].embeddable){
                href = data._links["wp:featuredmedia"][0].href;                    
            }else
            if( typeof data._links["wp:attachment"] !== "undefined"  && data._links["wp:attachment"][0].embeddable ){
                href = data._links["wp:attachment"][0].href;                     
            } 
            if(!href){return}
            id = data.slug + "-media";
            title = jQuery("<span>").html( data.title.rendered )[0].innerText;
            jQuery('<a>',{ title: title, href: data.link, click: function(){return;}, target:""}).append(
                jQuery("<img>").attr({ src:"", width:"100%", height:"auto", id:id, })
            ).appendTo(config.target);
            jQuery.ajax({ type: "GET", url:href })
            .done(function (data) { 
                jQuery("#" + id).attr({src:data.source_url}) 
            })
            .fail(function (xhr, textStatus, errorThrown) {
                console.log(xhr.responseText);
                console.log(textStatus);
            });             
        }
        let render = function(data){
            if(config.header && config.header.title){
                jQuery('<h2>').append(
                    jQuery('<a>',{ text: config.header.title, title: config.header.title, href: config.header.url, click: function(){return;}, target:""})
                ).appendTo(config.target);
            }
            attachments(data);
            title = jQuery("<span>").html( data.title.rendered )[0].innerText;
            jQuery('<p>').html(
                jQuery('<a>',{ text: title, title: title, href: data.link, click: function(){return;}, target:""})
            ).appendTo(config.target);
            if(config.truncate){ data.content.rendered = truncate_func({str: data.content.rendered , url: data.link, length:config.truncate}) }    
            jQuery('<p>').html(data.content.rendered).appendTo(config.target);
        }
        if( data instanceof Array ){
            for(var d in data){
                render(data[d]);
            }
        } else {
            render(data);
        }       
                    
        jQuery(config.target).show();
    }
    blogger_render = function(data, config){
        let truncate_func=function(t){return"undefined"!==jQuery.truncate&&(t.str=jQuery.truncate(t.str,{length:t.length?t.length:150,finishBlock:!0,ellipsis:t.url?" <a href='"+t.url+"' target='_blank' title='more'>[...]</a>":""})),t.str};    
        // setting up nextpage token for googleapi
        widget_client.page.set( config.header.title, { nextPageToken: data.nextPageToken } );       
        for(var d in data.items){
            jQuery('<h2>').append(
                jQuery('<a>',{ text: config.header.title, title: config.header.title, href: config.header.url, click: function(){return;}, target:""})
            ).appendTo(config.target);
            jQuery('<p>').append(
                jQuery('<a>',{ text: data.items[d].title, title: data.items[d].title, href: data.items[d].url, click: function(){return;}, target:""})
            ).appendTo(config.target);
            if(config.truncate){ data.items[d].content = truncate_func({str: data.items[d].content , url: data.items[d].url, length:config.truncate}) }
            jQuery(data.items[d].content).appendTo(config.target);
            jQuery(config.target).find("img").attr({ height: 'auto', width: '100%' }).closest("a").attr({href: data.items[d].url})                
            jQuery(config.target).find("iframe").detach()
        }                    
        jQuery(config.target).show();
    }
    youtube_playlist = function(data, config){
        widget_client.page.set( config.header.title, { nextPageToken: data.nextPageToken } );       
        jQuery('<h2>').append(
            jQuery('<a>',{ text: config.header.title, title: config.header.title, href: config.header.url, click: function(){return;}, target:""})
        ).appendTo(config.target);
        let src = "";
        for(var d in data.items){
            src = "https://www.youtube.com/embed/?listType=playlist&list=" + data.items[d].id.playlistId
            jQuery("<iframe>").attr({"src": src, "width": "100%", "height": "auto", "frameborder": "0", "allowfullscreen": "true" }).appendTo(config.target);
        }
                            
        jQuery(config.target).show();
    }    
    reddit_render(data, config){
        if (data.data.children.length > 0) {
            let t = "";
            let truncate_func=function(t){return"undefined"!==jQuery.truncate&&(t.str=jQuery.truncate(t.str,{length:t.length?t.length:150,finishBlock:!0,ellipsis:t.url?" <a href='"+t.url+"' target='_blank' title='more'>[...]</a>":""})),t.str};    
            let media_render = function(res){
                let content = jQuery("<span>").html(res.data.media_embed.content)[0].innerText;
                jQuery(config.target).append( content )
                jQuery(config.target).find('iframe').attr({ height:'auto',width:'100%'});
            }             
            jQuery.each(data.data.children, function(idx, res) {
                jQuery('<h2>').append(
                    jQuery('<a>',{ text: config.header.title, title: config.header.title, href: config.header.url, click: function(){return;}, target:""})
                ).appendTo(config.target);
                jQuery('<p>').append(
                    jQuery('<a>',{ text: res.data.title, title: res.data.title, href: res.data.url, click: function(){return;}, target:""})
                ).appendTo(config.target);
                if(res.data.media_embed.content){
                    media_render(res);
                }
                t = jQuery("<p>").html( res.data.selftext_html )[0].innerText;
                if(config.truncate){ t = truncate_func({str: t , url: res.data.url, length:config.truncate}) }
                jQuery(config.target).append( t ) ;                            
            });
            jQuery(config.target).show();
        } else {
            console.log("No subreddits match the search query!");
        }
    }       
}
