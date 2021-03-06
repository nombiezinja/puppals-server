
$(document).ready(function(){

//profile update

  $(".edit").on('click', function(){
    $('.puppy-card').slideToggle('fast');
    $('.statuses').slideToggle('fast');
    $('.new-status').slideToggle('fast');
    $('.edit-profile').slideToggle('fast');
    $('.back').slideToggle('fast');
    $('.seperator').slideToggle('fast');    
    $('.edit').hide();
  });

  $(".back").on('click', function(event){
    $('.puppy-card').slideToggle('fast');
    $('.statuses').slideToggle('fast');
    $('.new-status').slideToggle('fast');
    $('.edit-profile').slideToggle('fast');
    $('.seperator').slideToggle('fast');        
    $('.back').hide();
    $('.edit').slideToggle('fast');
  });

  function createProfileElements(profile) {

    var sex = (profile.sex == "Male") ? 'Boy' : 'Girl'
    var neutered = (profile.neutered == true) ? 'Neutered': 'Not Neutered'

    var $div1 = $("<div>", {class: "puppy-card"})
    var $div2 = $("<div>", {class: "puppy-box"})

    var $img = $("<img>", {class:"pup-pic", src:profile.avatar_url});
    var $h2 = $("<h2>", {class:"listContent",text: profile.name});

    var $div3 = $("<div>", {class:"pup-info"})

    var $pBreed = $("<p>", {text:profile.breed})
    var $pAge = $("<p>", {text: `${profile['age']} years old`})
    var $pSex = $("<p>", {text: `${sex}`})
    var $pNeutered = $("<p>", {text: `${neutered}`})

    $div3.append($pBreed).append($pAge).append($pSex).append($pNeutered)
    $div2.append($img).append($h2).append($div3)
    $div1.append($div2)
    return $div1;
  }

  function renderProfile(profileData) {
    $('.profile').empty()
    var $profile = createProfileElements(profileData)
    $('.profile').append($profile)
  }

  function loadProfile(){
    $.ajax({
      url: `/api/pet/profile/${id}`
    }).done(function(profile){
      renderProfile(profile[0]);
    });
  }

  loadProfile()

  $('.edit-form').on('submit', function(event){
    event.preventDefault();
    $.ajax({
      method:'POST',
      url: `/api/pet/profile/${id}`,
      data: $(this).serialize()
    }).done(function(){
      loadProfile()
      $('.edit-form .input').val('');
      $('.edit-profile').slideToggle();
      $('.puppy-card').slideToggle();
      $('.statuses').slideToggle();
      $('.back').hide();
      $('.edit').slideToggle();
    })
  })

//status updates

  $(".new-status textarea").on("input", function(event){
    var length = $(this).val().length;
    var remaining = 140 - length;
    var $counter = $(this).parent().children('.counter');
    $counter.text(remaining);
    if (remaining < 0) {
      $counter.addClass('changeRed');
    } else {
      $counter.removeClass('changeRed');
    }
  });

  function createStatusesElements(statuses) {
    var $section = $('<section>')
    statuses.forEach((status) => {
      var $timeSpan = $('<span>', {class: 'status-time', text: moment(status.created_at).format("ddd MMMM Do YYYY") + " at " + moment(status.created_at).format("h:mm a")})
      var $textSpan = $('<span>', {class: 'status-text',text: " | " + status.content});
      var $div = $('<div>')
      $div.append($timeSpan).append($textSpan)
      $section.prepend($div)
    })
    return $section;
  }

  function renderStatuses(statusesData){
    $('.statuses').empty();
    var $newStatuses = createStatusesElements(statusesData)
    $('.statuses').prepend($newStatuses);
  }

  function loadStatuses(){
    $.ajax({
      url: `/api/pet/${id}`
    }).done(function(statuses){
      renderStatuses(statuses);
    })
  }

  $('.status-form').on('submit', function(event){
    event.preventDefault();
    var $inputLength = $('.status-form textarea').val().length;
    if($inputLength === 0) {
      alert('Hey bud, your status can\'t be empty(Ծ‸ Ծ)')
      return;
    } else if($inputLength > 140) {
      alert('Whoa there friendo, your status is over 140 characters ◔_◔');
      return;
    } else {
      $.ajax({
        method: 'POST',
        url: `/api/pet/${id}`,
        data: $(this).serialize()
      }).done(function(){
        $('.status-form textarea').val('');
        loadStatuses();
      });
    }
  });

  loadStatuses();

})