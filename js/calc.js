var rangeSlider = function(){
  var slider = $('.range-slider'),
      range = $('.range-slider__range'),
      value = $('.range-slider__value');

  slider.each(function(){

    value.each(function(){
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });

    range.on('input', function(){
      $(this).next(value).html(this.value);
    });
  });
};

rangeSlider();


// grab everything we need
    const priceInput    = document.querySelector('[name=price]');
    const quantityInput = document.querySelector('[name=quantity]');
    const total         = document.querySelector('.total');
    const quantityLabel = document.querySelector('.quantity-label');

    // create the functions that we'll need
    function calculatePieCost() {
      const price    = priceInput.value;
      const cost     = price * 2;
      console.log(cost);
      total.innerText = '$' + cost.toFixed(2);
    }

    function updateQuantityLabel() {
      const quantity = quantityInput.value;
      quantityLabel.innerText = quantity;
    }

    // on first run
    calculatePieCost();

    // add our event listeners
    priceInput.addEventListener('input', calculatePieCost);