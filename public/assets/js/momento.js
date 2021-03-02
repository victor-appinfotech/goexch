$(document).ready(function(){
  $('#body-main').on('click', '.trash-mdl', function () {
    var data = $(this).data();
    var model = $('#pkTrashModel');
    model.find('.turnkey').removeAttr('disabled').html('Delete');
    model.find('form').attr('action', data.target);
    model.find('input[name="resource_id"]').val(data.val);
    model.modal('show');
  })

  $('#body-main').on('click','.mdl',function(){
      var data = $(this).data();
        $.get(data.target,function(body){
          $('.com .modal-title').text(data.title);
          $('.com .modal-body').html(body);
          $('#pkComModel').modal('show');
        });
    });
  
    $('#body-main').on('click','.turnkey',function(e){
            e.preventDefault();
            var form = $(this).closest('form');
            var action = form.attr('action');

            $.fn.serializeObject = function()
            {
                var o = {};
                var a = this.serializeArray();
                $.each(a, function() {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {
                        o[this.name] = this.value || '';
                    }
                });
                return o;
            };

            $.post({
                url:action,
                data:form.serializeObject(),
                beforeSend:function(request){
                    request.setRequestHeader("CSRF-Token", tok);
                    $('.turnkey').attr('disabled','disabled').html('Processing...');
                },
                success:function(response, status, jqXHR){
                  if(response.exception) {

                    $('.error').text('');

                    if(response.err._error.nestedErrors){
                      $.each(response.err._error.nestedErrors, function (i, item) {
                        if (item.msg != 'Invalid value') {
                          $("." + item.param).html(item.msg);
                        }
                      });
                    }else{
                      $.each(response.err, function (i, item) {
                        $("." + i).text(item.msg);
                      });
                    }                      
                    
                  }else{
                    // console.log('Success');
                    window.location.replace(response.url);
                    return;
                  }

                  $('.turnkey').removeAttr('disabled').html('Create <i class="fas fa-paper-plane"></i>');
                },
                done:function() {
                  $('.turnkey').removeAttr('disabled').html('Create');
                },
                fail:function(jqxhr, settings, ex) { alert('failed, ' + ex); }
            })
        })
})