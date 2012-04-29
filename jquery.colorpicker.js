/**
 * jQuery Color Picker.
 *
 * Copyright (C) 2008-2011 Andreas Lagerkvist
 *
 * http://andreaslagerkvist.com/jquery/colour-picker/
 *
 * License: http://creativecommons.org/licenses/by/3.0/
 *
 * Use this plug-in on a normal <select>-element filled with colors to turn it in to a color-picker widget
 * that allows users to view all the colors in the drop-down as well as enter their own, preferred, custom color.
 *
 * Example of use: $('select[name="color"]').colorpicker();
 *
 * You can close the color-picker without selecting a color by clicking anywhere outside the color-picker box.
 */
(function($) {
  $.fn.colorpicker = function(conf) {
    // Config for plugin
    var config = $.extend({
      id: 'jquery-colorpicker',  // id of color-picker container
      ico: 'ico.gif',        // SRC to color-picker icon
      changeInputBackground: true,          // Whether to change the input's background to the selected color's
      speed: 500          // Speed of dialogue-animation
    }, conf);

    // Inverts a hex-color
    var hexInvert = function(hex) {
      var r = hex.substr(0, 2);
      var g = hex.substr(2, 2);
      var b = hex.substr(4, 2);

      return 0.212671 * r + 0.715160 * g + 0.072169 * b < 0.5 ? 'ffffff' : '000000'
    };

    // Add the color-picker dialogue if not added
    var colorpicker = $('#' + config.id);

    if (!colorpicker.length) {
      colorpicker = $('<div id="' + config.id + '"></div>').appendTo(document.body).hide();

      // Remove the color-picker if you click outside it (on body)
      $(document.body).click(function(event) {
        if (!($(event.target).is('#' + config.id) || $(event.target).parents('#' + config.id).length)) {
          colorpicker.hide(config.speed);
        }
      });
    }

    // For every select passed to the plug-in
    return this.each(function() {
      // Insert icon and input
      var select = $(this);
      var icon = $('<a href="#"><img src="' + config.ico + '" /></a>').insertAfter(select);
      var input = $('<input type="text" name="' + select.attr('name') + '" value="' + select.val() + '" size="6" />').insertAfter(select);
      var loc = '';

      // Build a list of colors based on the colors in the select
      $('option', select).each(function() {
        var option = $(this);
        var hex = option.val();
        var title = option.text();

        loc += '<li><a href="#" title="'
            + title
            + '" rel="'
            + hex
            + '" style="background: #'
            + hex
            + '; color: '
            + hexInvert(hex)
            + ';">'
            + title
            + '</a></li>';
      });

      // Remove select
      select.remove();

      // Change the input's background to reflect the newly selected color
      if (config.changeInputBackground) {
        input.change(function() {
          input.css({background: '#' + input.val(), color: '#' + hexInvert(input.val())});
        });

        input.change();
      }

      // When you click the icon
      icon.click(function() {
        // Show the color-picker next to the icon and fill it with the colors in the select that used to be there
        var iconPos = icon.offset();

        colorpicker.html('<ul>' + loc + '</ul>').css({
          position: 'absolute',
          left: iconPos.left + 'px',
          top: iconPos.top + 'px'
        }).show(config.speed);

        // When you click a color in the color-picker
        $('a', colorpicker).click(function() {
          // The hex is stored in the link's rel-attribute
          var hex = $(this).attr('rel');

          input.val(hex);

          // If user wants to, change the input's background to reflect the newly selected color
          if (config.changeInputBackground) {
            input.css({background: '#' + hex, color: '#' + hexInvert(hex)});
          }

          // Trigger change-event on input
          input.change();

          // Hide the color-picker and return false
          colorpicker.hide(config.speed);

          return false;
        });

        return false;
      });
    });
  };
})(jQuery);
