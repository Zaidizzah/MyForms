<!DOCTYPE html>
<html lang="en">
  <head>
  	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="MYFORMS sebagai program penyedia layanan form dan survei atau quis yang dapat dibuat sesuai kebutuhan" />
    <meta name="csrf_token" content="{{ csrf_token() }}">
    <title>Sign In - MYFORMS</title>

	<!-- MYFORMS favicon -->
    <link rel="shortcut icon" href="{{ asset('images/MYFORMS logo - no color for favicon.ico') }}">
    <!-- Main styles of signin page -->
	<link rel="stylesheet" type="text/css" href="{{ asset("assets/css/errors-notification.css") }}">
	<link rel="stylesheet" type="text/css" href="{{ asset("assets/css/app.css") }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/applications/css/auth.css') }}"/>
  </head>
  <body>
  	<div class="form-content-wrapper" aria-label="Form signin content wrapper">
		@includeWhen(session('flash-message'), 'partials.flash-message')

  		<div class="form-content">
  			<div class="form-info" aria-labelledby="form-info-header">
          		<p class="form-info-header" id="form-info-header">Sign In</p>
  				<img class="form-info-image" src="{{ asset('images/MYFORMS cropped logo - with color.png') }}" loading="lazy" alt="form">
  				<p class="form-info-policy">Privaci policy & Term of service</p>
  			</div>
  			<form class="form-detail" action="{{ route('signin') }}" method="post">
				@csrf

  				<div class="form-group" role="group">
  					<label for="email">E-MAIL</label>
  					<input type="email" name="email" id="your_email" class="input" placeholder="Isikan dengan email yang valid" maxlength="254" inputmode="email" aria-required="true" value="{{ old('email') }}" required pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}">
  				</div>
  				<div class="form-group" role="group">
  					<label for="password">PASSWORD</label>
  					<input type="password" name="password" id="password" class="input" placeholder="Isikan dengan password yang valid" maxlength="15" aria-required="true" required>
  				</div>
  				<div class="form-group" role="group" aria-label="Captcha input">
  					<label for="captcha">CAPTCHA</label>
					  <div class="recaptcha" id="recaptcha" role="group" aria-label="Captcha image wrapper">
						<img src="{{ captcha_src() }}" data-tooltip="true" data-tooltip-title="Captcha image" loading="lazy" alt="captcha image">
						<button type="button" id="refresh-captcha" role="button" class="btn" tabindex="-1" data-tooltip="true" data-tooltip-title="Refresh captcha">Refresh</button>
					</div>
  					<input type="text" name="captcha" id="captcha" class="input" placeholder="Isikan dengan captcha yang valid" aria-required="true" required>
  				</div>
				<div class="form-group">
					<button type="submit" role="button" class="btn" data-tooltip="true" data-tooltip-title="Submit formulir">Sign In</button>
					<p>Or<a href="{{ route('signup.show') }}" role="button" class="btn" data-tooltip="true" data-tooltip-title="Buat akun baru">Sign Up</a></p>
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
