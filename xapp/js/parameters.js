(function() {
    // 1. Capture current parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paramsObj = {};
    for (const [key, value] of urlParams.entries()) {
        paramsObj[key] = value;
    }

    // 2. Global function for manual redirections
    window.redirectWithParams = function(targetUrl) {
        if (!targetUrl) return;
        
        try {
            const url = new URL(targetUrl, window.location.href);
            const targetParams = new URLSearchParams(url.search);
            
            // Merge current params into target
            for (const [key, value] of Object.entries(paramsObj)) {
                targetParams.set(key, value);
            }
            
            url.search = targetParams.toString();
            window.location.href = url.toString();
        } catch (e) {
            // Fallback for relative paths
            const separator = targetUrl.includes('?') ? '&' : '?';
            const queryString = urlParams.toString();
            window.location.href = targetUrl + (queryString ? separator + queryString : '');
        }
    };

    // 3. Automatically update all <a> tags
    function updateAllLinks() {
        if (urlParams.toString() === "") return;
        
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                try {
                    const url = new URL(href, window.location.href);
                    // Only update internal links or checkout links if needed
                    const linkParams = new URLSearchParams(url.search);
                    for (const [key, value] of Object.entries(paramsObj)) {
                        linkParams.set(key, value);
                    }
                    url.search = linkParams.toString();
                    link.href = url.toString();
                } catch (e) {
                    const separator = href.includes('?') ? '&' : '?';
                    link.href = href + separator + urlParams.toString();
                }
            }
        });
    }

    // 4. Run on load and observe changes
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAllLinks);
    } else {
        updateAllLinks();
    }

    // MutationObserver for dynamic content
    const observer = new MutationObserver(() => updateAllLinks());
    observer.observe(document.body, { childList: true, subtree: true });
})();

