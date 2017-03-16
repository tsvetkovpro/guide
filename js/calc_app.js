var ready;

$(document).bind('page:change', function() {
  $.fancybox.init();
  return $("#loading_div").hide();
});

ready = function() {
  var $calc_tab, calc_cur_tab, calculate, update_month_percent_values;
  /* verstka(); */
  /* $('.gallery').fancybox(); */
  /* $('.fancybox_in_text').each(function() {
    var imageurl;
    imageurl = $(this).attr('src');
    return $(this).wrap('<a href="' + imageurl + '" rel="gallery1" class="fancybox_link_in_text"></a>');
  }); */
 /*  $('a.fancybox_link_in_text').fancybox();*/
  $calc_tab = $('.widget-calc .tab a');
  calc_cur_tab = 1;
  $calc_tab.on('click', function() {
    var this_index;
    this_index = $(this).data('id');
    if (calc_cur_tab !== this_index) {
      $('.widget-calc .tab a.active').removeClass('active');
      $(this).addClass('active');
      $('.widget-calc .item[data-id="' + calc_cur_tab + '"], .widget-calc .inform[data-id="' + calc_cur_tab + '"]').addClass('hidden');
      $('.widget-calc .item[data-id="' + this_index + '"], .widget-calc .inform[data-id="' + this_index + '"]').removeClass('hidden');
      calc_cur_tab = this_index;
    }
    return false;
  }); 
  calculate = function($form) {
    return $.ajax({
      url: 'php/calc.php',
      data: $form.serialize(),
      success: function(data) {
        $form.parents('.item').find('.total .sum').html(data);
        $form.parents('.item').find('.total .finsum').val(data);
      }
    });
  };
  update_month_percent_values = function($item, ui_value) {
    var $slider, month_value, percent_value;
    if (ui_value == null) {
      ui_value = null;
    }
    $slider = $item.find('.slider:not(.hidden)');
    ui_value = ui_value === null ? $slider.find('.box').slider("value") : ui_value;
    month_value = $slider.find('.u_' + ui_value).data('value');
    percent_value = $slider.find('.d_' + ui_value).data('value');
    $item.find('.input-id-1').val(month_value);
    $item.find('.total .text span').html(month_value);
    return $item.find('.input-id-2').val(percent_value);
  };
  $('.slider .box').each(function() {
    var max_value;
    max_value = $(this).nextAll('.u').length - 1;
    return $(this).slider({
      animate: true,
      range: 'min',
      min: 0,
      max: max_value,
      value: 0,
      slide: function(event, ui) {
        update_month_percent_values($(this).parents('.item'), ui.value);
        return calculate($(this).parents('form'));
      }
    });
  });
  $('.ante input').on('change', function() {
    var find_slider, sum_value;
    sum_value = parseInt($(this).val());
    find_slider = false;
    $(this).parents('.item').find('.slider').each(function() {
      var max_sum, min_sum;
      min_sum = parseInt($(this).data('min'));
      max_sum = parseInt($(this).data('max'));
      if ((min_sum <= sum_value) && (max_sum >= sum_value)) {
        find_slider = true;
        if ($(this).hasClass('hidden')) {
          return $(this).removeClass('hidden').siblings('.slider').addClass('hidden');
        }
      }
    });
    if (find_slider) {
      $(this).parents('.item').find('.total .regular').show().prev('.hidden-text').hide().parent('.text').next('.sum').show().next('.sum-desc').show();
      $(this).closest('form').find('input[type="submit"]').removeAttr('disabled');
      update_month_percent_values($(this).parents('.item'));
      return calculate($(this).parents('.item').find('form'));
    } else {
      $(this).parents('.item').find('.total .regular').hide().prev('.hidden-text').show().parent('.text').next('.sum').hide().next('.sum-desc').hide();
      return $(this).closest('form').find('input[type="submit"]').attr('disabled', 'disabled');
    }
  });
  $('.widget-calc form').each(function() {
    return calculate($(this));
  });
 /*  $('input[id*="saving_pensioner"][type="checkbox"]').change(function() {
	if($('input[id*="spec_twenty_four"][type="checkbox"]').is(':checked')){
		$('input[id*="spec_twenty_four"][type="checkbox"]').prop( "checked", false );
		$('input[id*="spec_twenty_four"]~.jq-checkbox').removeClass('checked');
	}
    var $input_percent, $slider_percents, checked, local_val_input;
    checked = $(this).is(':checked') ? 1 : -1;
    $slider_percents = $(this).closest('.item').find('.slider .d');
    $slider_percents.each(function() {
      var local_val;
      local_val = parseInt($(this).data('value')) + checked;
      return $(this).data('value', local_val).html(local_val + "%");
    });
    $input_percent = $(this).closest('.item').find('input[id*="saving_percent"]');
    local_val_input = parseInt($input_percent.val()) + checked;
    $input_percent.val(local_val_input);
    return calculate($(this).closest('form'));
  }); */
  /* С того мамой танцевал, кто такие калькуляторы придумал */
  $('input[id*="saving_pensioner"][type="checkbox"]').change(function() { 
	if($('input[id*="spec_twenty_four"][type="checkbox"]').is(':checked')){
		$('input[id*="spec_twenty_four"][type="checkbox"]').prop( "checked", false );
		$('input[id*="spec_twenty_four"]~.jq-checkbox').removeClass('checked');
	}
    var $input_percent, $slider_percents, checked, local_val_input;
    checked = $(this).is(':checked') ? 1 : -1;
    $slider_percents = $(this).closest('.item').find('.slider .d');
    $slider_percents.each(function() {
      var local_val;
	  if(checked == 1){
		local_val = Number($(this).attr('data-value')) + 1;
	  }else{
		local_val = Number($(this).attr('data-value'));
	  }
      return $(this).data('value', local_val).html(local_val + "%");
    });
    $input_percent = $(this).closest('.item').find('input[id*="saving_percent"]');
	if(checked == 1){
		local_val_input = Number(update_month_percent_values($(this).closest(".item")).val());
	}else{
        local_val_input = update_month_percent_values($(this).closest(".item")).val();
	}
    $input_percent.val(local_val_input);
    return calculate($(this).closest('form'));
  });

  $('input[id*="spec_twenty_four"][type="checkbox"]').change(function() {
	if($('input[id*="saving_pensioner"][type="checkbox"]').is(':checked')){
		$('input[id*="saving_pensioner"][type="checkbox"]').prop( "checked", false );
		$('input[id*="saving_pensioner"]~.jq-checkbox').removeClass('checked');
	}
    var $input_percent, $slider_percents, checked, local_val_input;
    checked = $(this).is(':checked') ? 1 : -1;
    $slider_percents = $(this).closest('.item').find('.slider .d');
    $slider_percents.each(function() {
      var local_val;
	  if(checked == 1){
		local_val = 24;
	  }else{
		local_val = parseInt($(this).attr('data-value'));
	  }
      return $(this).data('value', local_val).html(local_val + "%");
    });
    $input_percent = $(this).closest('.item').find('input[id*="saving_percent"]');
	if(checked == 1){
		$input_percent_tmp = $(this).closest('.item').find('input[id*="saving_percent"]').val();
		local_val_input = 24;
	}else{
		//local_val_input = $input_percent_tmp;
        local_val_input = update_month_percent_values($(this).closest(".item")).val();
	}
    $input_percent.val(local_val_input);
    return calculate($(this).closest('form'));
  });

  /* $('#new_user').validate(); */
  /* $('#new_user').submit(function() {
    return $('#new_user').valid != null;
  }); */
  /* return $('form[id*="edit_saving"]').submit(function() {
    if ($(this).find('input[type="checkbox"]:checked').length === 0) {
      return false;
    }
  }); */
};

$(document).ready(ready);

$(document).on('page:load', ready);
