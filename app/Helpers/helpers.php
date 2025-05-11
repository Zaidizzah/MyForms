<?php

if (!function_exists('build_resource_array')) {
    /**
     * Build an associative array representing a resource.
     *
     * This function creates an array that encapsulates various details
     * about a resource, including its title, subtitle, icon, description,
     * breadcrumb navigation, CSS stylesheets, and JavaScript files.
     *
     * @param string $title The title of the resource.
     * @param array $breadcrumb An array representing the breadcrumb trail for navigation.
     * @param array $css An array of CSS files related to the resource.
     * @param array $javascript An array of JavaScript files related to the resource.
     * 
     * @return array An associative array containing the resource details.
     */
    function build_resource_array(
        string $title,
        array $breadcrumb,
        array $css = [],
        array $javascript = [],
        array $additional = []
    ): array {
        return [
            'title' => $title,
            'breadcrumb' => $breadcrumb,
            'css' => $css,
            'javascript' => $javascript,
            ...$additional
        ];
    }
}

if (!function_exists('generate_tags')) {
    /**
     * Generate HTML tags for scripts or links based on the provided configuration.
     *
     * @param string $type The type of tags to generate ('link' for CSS, 'script' for JS).
     * @param array $tags An array of configurations for each tag.
     *                     Each configuration should be an associative array with
     *                     keys corresponding to the attributes of the tag.
     *                     For 'link', valid keys are 'href', 'rel', 'type', 'media',
     *                     'base_path', 'integrity', 'crossorigin'.
     *                     For 'script', valid keys are 'src', 'async', 'defer', 'type',
     *                     'integrity', 'crossorigin', 'base_path', 'inline'.
     *
     * @return string Returns a string of concatenated HTML tags.
     *                Returns an empty string if no valid tags are provided.
     */
    function generate_tags(string $type, ?array $tags): string
    {
        // Validate input
        if (empty($tags)) {
            return '';
        }

        // Default configuration for link (CSS)
        $linkDefaults = [
            'href' => null,       // Source CSS
            'rel' => 'stylesheet', // Default rel for stylesheet
            'type' => 'text/css', // CSS type
            'media' => 'all',     // Target media
            'base_path' => '',    // Base path for local files
            'integrity' => null,  // Resource integrity
            'crossorigin' => null, // Cross-origin settings
        ];

        // Default configuration for script
        $scriptDefaults = [
            'src' => null,        // Source script
            'async' => false,     // Async loading
            'defer' => false,     // Defer loading
            'type' => 'text/javascript', // Script type
            'integrity' => null,  // Script integrity
            'crossorigin' => null, // Cross-origin settings
            'base_path' => '',    // Base path for local scripts
            'inline' => null,     // Inline content
        ];

        // Default configuration for meta tags
        $metaDefaults = [
            'name' => null,       // Meta name
            'content' => null,    // Meta content
            'property' => null,   // Meta property
            'http-equiv' => null, // Meta http-equiv
            'charset' => null,    // Meta charset
        ];

        // Select default configuration based on type
        $defaultConfig = $type === 'link' ? $linkDefaults : ($type === 'script' ? $scriptDefaults : $metaDefaults);

        // Container for generated tags
        $generatedTags = [];

        // Process each tag configuration
        foreach ($tags as $tagConfig) {
            // Merge default config with provided configuration
            $config = array_merge($defaultConfig, $tagConfig);

            // Process link tags
            if ($type === 'link') {
                // Validate href source
                if (empty($config['href'])) {
                    continue;
                }

                // Determine URL
                $url = $config['href'];
                if (!filter_var($url, FILTER_VALIDATE_URL)) {
                    // If not an absolute URL, append base path
                    $url = rtrim($config['base_path'], '/') . '/' . ltrim($url, '/');
                }

                // Prepare additional attributes
                $additionalAttributes = [];

                if ($config['integrity']) {
                    $additionalAttributes[] = sprintf('integrity="%s"', htmlspecialchars($config['integrity']));
                }

                if ($config['crossorigin']) {
                    $additionalAttributes[] = sprintf('crossorigin="%s"', htmlspecialchars($config['crossorigin']));
                }

                // Create link tag
                $generatedTags[] = sprintf(
                    '<link rel="%s" type="%s" href="%s" media="%s"%s>',
                    htmlspecialchars($config['rel']),
                    htmlspecialchars($config['type']),
                    htmlspecialchars($url),
                    htmlspecialchars($config['media']),
                    $additionalAttributes ? ' ' . implode(' ', $additionalAttributes) : ''
                );
            }
            // Process meta tags
            else if ($type === 'meta') {
                // Prepare additional attributes
                $additionalAttributes = [];

                if ($config['name']) {
                    $additionalAttributes[] = sprintf('name="%s"', htmlspecialchars($config['name']));
                } elseif ($config['property']) {
                    $additionalAttributes[] = sprintf('property="%s"', htmlspecialchars($config['property']));
                } elseif ($config['http-equiv']) {
                    $additionalAttributes[] = sprintf('http-equiv="%s"', htmlspecialchars($config['http-equiv']));
                } elseif ($config['charset']) {
                    $additionalAttributes[] = sprintf('charset="%s"', htmlspecialchars($config['charset']));
                }

                // Create meta tag
                $generatedTags[] = sprintf(
                    '<meta%s content="%s">',
                    $additionalAttributes ? ' ' . implode(' ', $additionalAttributes) : '',
                    htmlspecialchars($config['content'])
                );
            }
            // Process script tags
            else {
                // Prioritize inline script if present
                if (isset($config['inline']) && $config['inline'] !== null) {
                    $generatedTags[] = sprintf(
                        '<script type="%s">%s</script>',
                        htmlspecialchars($config['type']),
                        $config['inline']
                    );
                    continue;
                }

                // Validate script source
                if (empty($config['src'])) {
                    continue;
                }

                // Determine URL
                $url = $config['src'];
                if (!filter_var($url, FILTER_VALIDATE_URL)) {
                    // If not an absolute URL, append base path
                    $url = rtrim($config['base_path'], '/') . '/' . ltrim($url, '/');
                }

                // Prepare additional attributes
                $additionalAttributes = [];

                if ($config['async']) {
                    $additionalAttributes[] = 'async';
                }

                if ($config['defer']) {
                    $additionalAttributes[] = 'defer';
                }

                if ($config['integrity']) {
                    $additionalAttributes[] = sprintf('integrity="%s"', htmlspecialchars($config['integrity']));
                }

                if ($config['crossorigin']) {
                    $additionalAttributes[] = sprintf('crossorigin="%s"', htmlspecialchars($config['crossorigin']));
                }

                // Create script tag
                $generatedTags[] = sprintf(
                    '<script type="%s" src="%s"%s></script>',
                    htmlspecialchars($config['type']),
                    htmlspecialchars($url),
                    $additionalAttributes ? ' ' . implode(' ', $additionalAttributes) : ''
                );
            }
        }

        // Return concatenated tags
        return implode("\n", $generatedTags);
    }
}
