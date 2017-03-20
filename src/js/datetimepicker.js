const NAME = "datetimepicker.js";
console.log("Filename: ", NAME);

const datetimepicker = ((element) => {

  let __element = element;

  element.addEventListener('click', function(e) {
    console.log("on click target, ", __element);
    
  });

});
