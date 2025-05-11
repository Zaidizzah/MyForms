<!-- Flash message section -->
<div class="flash-message {{ session("flash-message")['type'] }}" role="alert" aria-live="assertive" aria-atomic="true" aria-labelledby="flash-message-label" aria-describedby="flash-message-describe" aria-hidden="false">
    <h2 id="flash-message-label" class="flash-message-label">{{ session("flash-message")['title'] }}</h2>
    <p id="flash-message-describe" class="flash-message-describe">{{ session("flash-message")['message'] }}</p>

    <!-- Close button -->
    <button class="flash-message-close" type="button" role="button" data-tooltip="true" data-tooltip-title="Close message" aria-label="Close flash message"></button>
</div>