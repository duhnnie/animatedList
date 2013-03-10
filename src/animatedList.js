//Developed by Duhnnie -> www.duhnnie.net
// animatedList v. 0.1
// released on 26/07/2012
(function( $ ) {
	$.fn.animatedList = function(opciones){
	
		opciones_default = {
			"ancho": "100%",
			"alto": "100%",
			"duracion": 50000,
			"transicion": 300,
			"opacidadIn": 1,
			"opacidadOut": 0.5,
			"crossfade": true,
			"crossfadeDuracion": 600
		}
	
		opciones = $.extend(opciones_default, opciones);

		if(opciones.duracion < 1)
			throw new Error("La duración debe ser minimamente 1");

		function animar(o){
			var divp = $(o).parent().parent().children('.animatedList-desc');
			
			var div = $('<div class="animatedList-container"><h1 class="animatedList-title"><a href="'+$(o).children('a').attr('href')+'">'+$(o).children('a').children('img').attr("alt")+'</a></h1><p class="animatedList-body">'+$(o).attr('body')+'</p><div class="animatedList-footer">'+$(o).attr("footer")+'</div></div>');
			
			$(o).fadeTo(opciones.transicion/((opciones.crossfade)?1:2), opciones.opacidadIn, 'swing');
			if(opciones.crossfade)
				setTimeout(function(){
					divp.children(".animatedList-container").remove();
					divp.append(div);
					$(div).fadeTo(opciones.transicion/2, opciones.opacidadIn, "swing");
				}, opciones.transicion/2);
			else
			{
				divp.append(div);
				$(div).fadeTo(opciones.transicion/2, opciones.opacidadIn, "swing");
			}
			$(o).fadeTo(opciones.duracion, opciones.opacidadIn);
			$(o).queue(function(){
				var index = $(o).index(); 
				index++;
				if(index == $(this).parent().children('li').length)
					index = 0;
				div.fadeOut(opciones.transicion/2, 'swing', function(){
					$(this).remove();
					if(!opciones.crossfade)
						animar(divp.parent().children('ul').children("li:eq("+(index)+")"));
				});
				$(this).fadeTo(opciones.transicion/((opciones.crossfade)?1:2), opciones.opacidadOut, 'swing');
				if(opciones.crossfade)
					animar($(this).parent().children("li:eq("+(index)+")"), true);
					
				$(this).dequeue();
			});
		}
	
		this.each(function(){
			var ul = this;
	
			$(this).removeClass().css({
				"width": opciones.ancho,
				"height": opciones.alto
			}).on('mouseover', 'li', function(e){
				$(e.delegateTarget).children('li').stop(true, false).css({"opacity":opciones.opacidadOut});
				$(this).fadeTo(opciones.transicion, opciones.opacidadIn, 'swing');
				$(this).parent().parent().children('.animatedList-desc').html('<div class="animatedList-container" style="display:block"><h1 class="animatedList-title"><a href="'+$(this).children('a').attr('href')+'">'+$(this).children('a').children('img').attr("alt")+'</a></h1><p class="animatedList-body">'+$(this).attr('body')+'</p><div class="animatedList-footer">'+$(this).attr("footer")+'</div></div>');
			}).on('mouseout', 'li', function(e){
				$(this).fadeTo(opciones.duracion, opciones.opacidadIn, 'swing');
				$(this).queue(function(){
					var index = $(this).index()+1;
					$(this).parent().parent().find('.animatedList-container').fadeOut(opciones.transicion/2, 'swing', function(){
						$(this).remove();
					});
					$(this).fadeTo(opciones.transicion, opciones.opacidadOut, 'swing', function(){
						if(!opciones.crossfade)
							animar($(ul).children("li:eq("+((index>=$(ul).children("li").length)?0:index)+")"));
					});
					if(opciones.crossfade)
						animar($(ul).children("li:eq("+((index>=$(ul).children("li").length)?0:index)+")"));

					$(this).dequeue();
				});
			}).children('li').removeClass().css({
				"opacity": opciones.opacidadOut
			}).find('*').css({"border":"none", "position":"static"});

			$(this).wrap('<div class="animatedList"/>');
			$(this).parent().append('<div class="animatedList-desc"></div>');
			
			animar($(this).children("li:eq(0)"));

		});
	}
})( jQuery );