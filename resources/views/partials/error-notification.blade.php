<!-- Error notification component -->
<div class="error-notification-container" role="alert" aria-live="assertive" aria-atomic="true" aria-relevant="additions" aria-labelledby="error-notification-title" aria-owns="error-notification-content" aria-ownedby="error-notification-toggle" aria-describedby="error-notification-content">
    <span id="error-notification-title" class="error-notification-title">Errors</span>
    <button class="error-notification-remove" role="button" aria-label="Remove error notification" data-tooltip="true" data-tooltip-title="Remove error notification"></button>

    <div id="error-notification-toggle" class="error-notification-toggle shake" role="button" aria-label="Toggle error notification" data-tooltip="true" data-tooltip-title="Toggle error notification">
        <span class="error-notification-toggle-text">
            {{ $errors->first() ?? 'Ada beberapa kesalahan pada input Anda.' }} {{ $errors->count() > 1 ? "dan {$errors->count()} lainnya..." : '' }}
        </span>
    </div>

    <div id="error-notification-content" class="error-notification-content" aria-expanded="false" aria-hidden="true">
        <ul class="error-list" role="list">
            @foreach ($errors->getMessages() as $field => $messages)
                @foreach ($messages as $message)
                <li class="error-item">
                    <span class="error-item-field">{{ ucfirst($field) }}</span>
                    <span class="error-item-message">{{ $message }}</span>
                </li>
                @endforeach
            @endforeach
        </ul>
    </div>
</div>