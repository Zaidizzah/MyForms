<!DOCTYPE html>
<html lang="en">
  <head>
  	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="MYFORMS sebagai program penyedia layanan form dan survei atau quis yang dapat dibuat sesuai kebutuhan" />
    <meta name="csrf_token" content="{{ csrf_token() }}">
    <title>Sign Up - MYFORMS</title>

    <!-- MYFORMS favicon -->
    <link rel="shortcut icon" href="{{ asset('images/MYFORMS logo - no color for favicon.ico') }}">
    <!-- Main styles of signin page -->
	<link rel="stylesheet" type="text/css" href="{{ asset("assets/css/errors-notification.css") }}">
	<link rel="stylesheet" type="text/css" href="{{ asset("assets/css/app.css") }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/applications/css/auth.css') }}"/>
  </head>
  <body>
  	<div class="form-content-wrapper" aria-label="Form signup content wrapper">
		@includeWhen($errors->any(), 'partials.error-notification')

  		<div class="form-content">
  			<div class="form-info" aria-labelledby="form-info-header">
          		<p class="form-info-header" id="form-info-header">Sign Up</p>
  				<img class="form-info-image" src="{{ asset('images/MYFORMS cropped logo - with color.png') }}" loading="lazy" alt="form">
  				<p class="form-info-policy">Privaci policy & Term of service</p>
  			</div>
  			<form class="form-detail" action="{{ route('signup') }}" method="post">
				@csrf

  				<div class="form-group" role="group">
  					<label for="name">NAME</label>
  					<input type="text" name="name" id="name" class="input" value="{{ old('name') }}" placeholder="Isikan dengan nama yang valid" maxlength="120" aria-required="false">
  				</div>
  				<div class="form-group" role="group">
  					<label for="email">E-MAIL</label>
  					<input type="email" name="email" id="email" class="input" value="{{ old('email') }}" placeholder="Isikan dengan email yang valid" maxlength="254" inputmode="email" aria-required="true" required pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}">
  				</div>
  				<div class="form-group" role="group">
  					<label for="password">PASSWORD</label>
  					<input type="password" name="password" id="password" class="input" placeholder="Isikan dengan password yang valid" minlength="8" maxlength="15" data-tooltip="true" data-tooltip-title="Password minimal 8 karakter maksimal 15 karakter serta mengandung setidaknya satu huruf besar, huruf kecil, simbol dan angka" aria-required="true" required>
  				</div>
  				<div class="form-group" role="group">
  					<label for="comfirm_password">CONFIRM PASSWORD</label>
  					<input type="password" name="password_confirmation" id="comfirm_password" class="input" placeholder="Isikan dengan password sebelumnya" minlength="8" maxlength="15" data-tooltip="true" data-tooltip-title="Isikan dengan password sebelumnya" aria-required="true" required>
  				</div>
				<div class="form-group" role="group" aria-label="Captcha input">
					<label for="captcha">CAPTCHA</label>
					<div class="recaptcha" id="recaptcha" role="group" aria-label="Captcha image wrapper">
						<img src="{{ captcha_src() }}" data-tooltip="true" data-tooltip-title="Captcha image" loading="lazy" alt="captcha image">
						<button type="button" id="refresh-captcha" role="button" class="btn" tabindex="-1" data-tooltip="true" data-tooltip-title="Refresh captcha">Refresh</button>
					</div>
					<input type="text" name="captcha" id="captcha" class="input" placeholder="Isikan dengan captcha yang valid" aria-required="true" required>
				</div>
				<div class="form-group" role="group">
					<button type="submit" role="button" class="btn" data-tooltip="true" data-tooltip-title="Submit formulir">Sign Up</button>
					<p>Or<a href="{{ route('signin.show') }}" role="button" class="btn" data-tooltip="true" data-tooltip-title="Buat akun baru">Sign In</a></p>
				</div>
  			</form>
      	</div>
  	</div>

	@includeWhen($errors->any(), 'partials.error-notification')

	<!-- Banner section for under development -->
	<div class="banner" role="banner" id="banner" aria-label="Under development banner" aria-describedby="banner-description">
		<p id="banner-description" class="banner-description">Under development</p>
	</div>

	<!-- Script section -->
	<script type="text/javascript" src="{{ asset("assets/js/errorNotification.js") }}"></script>
	<script type="text/javascript" src="{{ asset("assets/js/tooltipManager.js") }}"></script>
	<script type="text/javascript" src="{{ asset("assets/js/app.js") }}"></script>
	<script type="text/javascript" src="{{ asset("assets/applications/js/auth.js") }}"></script>
  </body>
</html>
