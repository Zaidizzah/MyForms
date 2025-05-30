<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <meta name="description" content="MYFORMS sebagai program penyedia layanan form dan survei atau quis yang dapat dibuat sesuai kebutuhan" />
    <meta name="csrf_token" content="{{ csrf_token() }}">
    <title>{{ $title }} - MYFORMS</title>

    <!-- ICON -->
    <link rel="shortcut icon" sizes="16x16" href="{{ asset("images/MYFORMS logo - no color for favicon.ico") }}" type="image/x-icon">

    <!-- LINKS -->
    @generate_tags('link', $css)

    <link rel="stylesheet" type="text/css" href="{{ asset("assets/css/tablist.css") }}">
    <link rel="stylesheet" type="text/css" href="{{ asset("assets/css/table.css") }}">
    <link rel="stylesheet" type="text/css" href="{{ asset("assets/css/errors-notification.css") }}">
    <link rel="stylesheet" type="text/css" href="{{ asset("assets/css/app.css") }}">
  </head>
  <body>
    <!-- Header section -->
    <header class="navbar">
      <div class="navbar-left">
        {{-- <button type="button" role="button" class="navbar-toggler" data-tooltip="true" data-tooltip-title="Sidebar toggler">≡</button> --}}
        <div class="logo">
            <img src="{{ asset("images/MYFORMS logo - with color.svg") }}" loading="lazy" alt="MYFORM logo">
        </div>
      </div>

      <div class="navbar-center">
        <div class="search-container">
          <label for="main-search-contents">
            <img class="search-icon icon" src="{{ asset("images/application icons/search.png") }}" loading="lazy" alt="Search icon">
          </label>
          <input
            type="text"
            class="search-input"
            id="main-search-contents"
            placeholder="Type CTRL + / to search"
          />
        </div>
      </div>

      <div class="navbar-right">
        <div class="nav-item" data-tooltip="true" data-tooltip-title="Settings for MYFORMS">
            <a href="/" role="button" data><img class="icon" src="{{ asset("images/application icons/settings.png") }}" loading="lazy" alt="Settings icon"></a>
        </div>
        <div class="nav-item" data-tooltip="true" data-tooltip-title="Logout from MYFORMS">
            <a href="/" role="button"><img class="icon" src="{{ asset("images/application icons/logout.png") }}" loading="lazy" alt="Logout icon"></a>
        </div>
        <div class="nav-item">
            <div class="user-info">
                <span class="user-name">
                    Ahmad0126
                </span>
                <div class="avatar" data-tooltip="true" data-tooltip-title="Ahmad0126 avatar">
                    <img
                      src="{{ asset("images/dummys/default user profile - 2.png") }}"
                      loading="lazy"
                      alt="User avatar"
                    />
                </div>
            </div>
        </div>
      </div>
    </header>

    <!-- Navbar/Submenu section -->
    <nav class="submenu-wrapper">
      <button type="button" role="button" class="submenu-toggler" data-tooltip="true" data-tooltip-title="Toggle submenu" aria-label="Button to toggle visibility of submenu"><span></span></button>

      <div class="submenu">
          <a @class(['submenu-item', 'active' => request()->routeIs('dashboard')]) href="/" role="button" data-tooltip="true" data-tooltip-title="Dashboard menu">
            <div class="submenu-icon">
                <img class="icon" src="{{ asset("images/application icons/dashboard.png") }}" loading="lazy" alt="Settings icon">
            </div>
            Dashboard
          </a>
          <a @class(['submenu-item', 'active' => request()->routeIs('user.index')]) href="{{ route("user.index") }}" role="button" data-tooltip="true" data-tooltip-title="Users menu">
            <div class="submenu-icon">
                <img class="icon" src="{{ asset("images/application icons/users.png") }}" loading="lazy" alt="Users icon">
            </div>
            Users
          </a>
          <a @class(['submenu-item', 'active' => request()->routeIs('form.index', 'form.create', 'form.edit')]) href="{{ route("form.index") }}" role="button" data-tooltip="true" data-tooltip-title="Forms menu">
            <div class="submenu-icon">
                <img class="icon" src="{{ asset("images/application icons/forms.png") }}" loading="lazy" alt="Forms icon">
            </div>
            Forms
          </a>
      </div>
    </nav>

    <!-- Main section -->
    <main class="main-content">
      @includeWhen(session('flash-message'), 'partials.flash-message')

      <!-- Breadcrumb section -->
      <div class="breadcrumb" aria-label="Breadcrumb navigation">
        <a href="#" class="active" aria-current="false">MYFORMS</a>
        @isset($breadcrumb)
            @if (is_array($breadcrumb))
                @foreach ($breadcrumb as $value)
                    <a href="{{ $value['link'] && $value['link'] !== null ? $value['link'] : '#' }}" @class(['breadcrumb-item', 'active' => ($value['active'] && $value['active'] === true)]) aria-current="{{ $value['active'] && $value['active'] === true ? 'page' : 'false' }}">{{ $value['name'] }}</a>
                @endforeach
            @endif
        @endisset
      </div>
      
      <!-- Opening section -->
      <section class="opening-section" aria-labelledby="opening-section-label" aria-describedby="opening-section-describe">
          <h2 id="opening-section-label">Selamat datang di MYFORMS</h2>
          <p id="opening-section-describe">Sebuah program dimana anda dapat membuat formulir atau kuis anda sendiri untuk dipublikasikan.</p>
      </section>

      <!-- Container section -->
      @yield('container')
      
      @includeWhen($errors->any(), 'partials.error-notification')
    </main>

    <!-- Icons image credits -->
    <div class="icons-credit" aria-describedby="icons-credit-info">
        <button type="button" role="button" class="icons-credit-toggler" data-tooltip="true" data-tooltip-title="Toggle icon credit" aria-label="Button to toggle visibility of icons credit"><span></span></button>

        <span id="icons-credit-info" style="color: #c00;">Do not share my personal information in this site </span><span>- All icons found on this website are made by creators from <strong>Freepik</strong> >></span><a href="https://www.flaticon.com/free-icons/settings" role="button" title="settings icons">Settings icons created by srip - Flaticon</a><span> >></span><a href="https://www.flaticon.com/" role="button" title="Many more...">Many more...</a>

        <button type="button" role="button" class="going-to-top" data-tooltip="true" data-tooltip-title="Button to top" aria-label="Button to top of page"><span></span></button>
    </div>

    <!-- Scripts section -->
    <script type="text/javascript" src="{{ asset("assets/js/tablist.js") }}"></script>
    <script type="text/javascript" src="{{ asset("assets/js/errorNotification.js") }}"></script>
    <script type="text/javascript" src="{{ asset("assets/js/tooltipManager.js") }}"></script>
    <script type="text/javascript" src="{{ asset("assets/js/app.js") }}"></script>
    @generate_tags('script', $javascript)
  </body>
</html>
