$(document).ready(function () {
  // common functions for all pages
  const payPerShift = 75000; // 75k VND per shift
  var today = new Date().toISOString().split('T')[0];

  $('#myModal').on('hidden.bs.modal', function () {
    document.activeElement.blur(); // tránh cảnh báo aria-hidden
  });


  // time-keeping.html functions
  switch (window.location.pathname.split('/').pop()) {
    case 'time-keeping.html':
      // functions
      function initForm() {
        $('#inputWorkingDays').val(today);
        $('#inputWorkingDays').attr('max', today);
        $('input[name="radioWorkStatus"][value="Working"]').prop('checked', true);
        $('input[name="checkboxWorkShift"]').val([]);
        $('input[name="checkboxWorkShift"]').prop('disabled', false);
        $('#inputNote').val('');
      }

      // init
      initForm();
      var totalPayToday = 0;
      var objJobOverview = {};
      $.ajax({
        url: "https://68fb756d94ec960660261d01.mockapi.io/api/v1/job-overview/1",
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
          objJobOverview = data;
        }
      });

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

        initForm();
        $('#myModal').modal('show');
        /*
        $.ajax({
          url: "https://68fb756d94ec960660261d01.mockapi.io/api/v1/time-keeping/",
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(obj),
          success: function (data1) {
            console.log(data1);
            objJobOverview.totalPay += totalPayToday;
            objJobOverview.totalUnpaid += totalPayToday;
            $.ajax({
              url: "https://68fb756d94ec960660261d01.mockapi.io/api/v1/job-overview/1",
              type: 'PUT',
              contentType: 'application/json',
              data: JSON.stringify(objJobOverview),
              success: function (data2) {
                $('#modalBodyText').text(`Done : Your total pay today is ${totalPayToday}k VND`);
                $('#myModal').modal('show');
              },
              error: function (error) {
                $('#modalBodyText').text(`Error : ${error.responseJSON}`);
                $('#myModal').modal('show');
              }
            });
          },
          error: function (error) {
            $('#modalBodyText').text(`Error : ${error.responseJSON}`);
            $('#myModal').modal('show');
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
      break;
    case 'job-overview.html':
      // job-overview.html functions
      // functions
      // init
      $.ajax({
        url: "https://68fb756d94ec960660261d01.mockapi.io/api/v1/job-overview/1",
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
          $('#totalShifts').text(`${(data.totalPay / 75000).toLocaleString('en-US')}`);
          $('#totalPay').text(`${data.totalPay.toLocaleString('en-US')} VND`);
          $('#totalReceived').text(`${(data.totalPay - data.totalUnpaid).toLocaleString('en-US')} VND`);
          $('#totalUnpaid').text(`${data.totalUnpaid.toLocaleString('en-US')} VND`);
        },
        error: function (error) {
          $('#modalBodyText').text(`Error : ${error.responseJSON}`);
          $('#myModal').modal('show');
        }
      });

      $('#inputPayDate').val(today);
      $('#inputPayDate').attr('max', today);

      
      break;

    default:
      break;
  }

});
