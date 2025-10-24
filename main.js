$(document).ready(function () {

  // init
  initForm();
  const payPerShift = 75; // 75k VND per shift
  var totalPayToday = 0;
  
  // event
  $(document).on("click", 'a[href^="#"]', function (event) {
    event.preventDefault();

    //console.log("Smooth scrolling activated!");
  });

  $(`#inputWorkingDays`).on("input", function () {
    if ($(this).val()) {
      $(this).next("#alertInputWorkingDays").addClass("d-none");
    } else {
      $(this).next("#alertInputWorkingDays").removeClass("d-none");
    }
  });

  $('input[name="radioWorkStatus"]').on('change', function () {
    const isOff = $(this).val() === 'Off';
    $('input[name="checkboxWorkShift"]').val([]);
    $('input[name="checkboxWorkShift"]').prop('disabled', isOff);

    $('#alertCheckboxWorkShift').removeClass('d-inline');
    $('#alertCheckboxWorkShift').addClass('d-none');
  });

  $('#btnSave').on('click', function () {
    const wrkDate = $('#inputWorkingDays').val();
    const wrkStas = $('input[name="radioWorkStatus"]:checked').val();
    const note = $('#inputNote').val();
    const workShift = $('input[name="checkboxWorkShift"]:checked')
      .map(function () {
        return this.value;
      })
      .get(); // -> chuyển jQuery object thành mảng thuần

    totalPayToday = workShift.length * payPerShift;

    const obj = {
      "wrkDate": wrkDate,
      "wrkStas": wrkStas,
      "note": note,
      "workShift": workShift
    }

    const checkValid = validateTimeKeepingForm(wrkDate, wrkStas, note, workShift);
    if (!checkValid) {
      return;
    }

    console.log(obj);
    initForm();

    /*
    $.ajax({
      url: "https://68fb756d94ec960660261d01.mockapi.io/api/v1/time-keeping/",
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(obj),
      success: function (data) {
        console.log('Data saved successfully:', data);
      }
    });
    */

  });

  // validation
  function validateTimeKeepingForm(wrkDate, wrkStas, note, workShift) {
    if (!wrkDate) {
      $('#alertInputWorkingDays').removeClass('d-none');
      return false;
    }

    if (wrkStas === 'Working' && workShift.length === 0) {
      $('#alertCheckboxWorkShift').removeClass('d-none');
      $('#alertCheckboxWorkShift').addClass('d-inline');
      return false;
    } else {
      $('#alertCheckboxWorkShift').removeClass('d-inline');
      $('#alertCheckboxWorkShift').addClass('d-none');
    }

    return true;
  }

});

// functions
function initForm() {
  $(`#inputWorkingDays`).val(new Date().toISOString().split('T')[0]);
  $('#inputWorkingDays').attr('max', new Date().toISOString().split('T')[0]);
  $('input[name="radioWorkStatus"][value="Working"]').prop('checked', true);
  $('input[name="checkboxWorkShift"]').val([]);
  $('input[name="checkboxWorkShift"]').prop('disabled', false);
  $('#inputNote').val('');
}
