(function () {
    "use strict";

    const TARGET_URLS = [
        "Microsoft_Azure_PIMCommon/ActivationMenuBlade",
        "aadmigratedroles"
    ];

    let currentUrl = location.href;
    let sortedForThisVisit = false;
    let observer = null;

    function isPimPage() {
        return TARGET_URLS.every(part =>
            location.href.includes(part)
        );
    }

    function getVisibleRoleHeader() {
        const headers = document.querySelectorAll(".azc-grid-headerlabel");

        for (const header of headers) {
            if (header.textContent.trim() !== "Role") {
                continue;
            }

            const rect = header.getBoundingClientRect();

            const visible =
                rect.width > 0 &&
                rect.height > 0 &&
                header.offsetParent !== null;

            if (visible) {
                return header;
            }
        }

        return null;
    }

    function clickRoleHeader() {
        if (sortedForThisVisit) {
            return true;
        }

        const header = getVisibleRoleHeader();

        if (!header) {
            return false;
        }

        console.log(
            "PIM Role Sorter: found visible Role header, sorting"
        );

        header.click();

        setTimeout(() => {
            header.click();
        }, 500);

        sortedForThisVisit = true;
        return true;
    }

    function armWatcher() {
        if (!isPimPage()) {
            return;
        }

        sortedForThisVisit = false;

        console.log(
            "PIM Role Sorter: arming watcher for",
            location.href
        );

        if (observer) {
            observer.disconnect();
        }

        if (clickRoleHeader()) {
            return;
        }

        observer = new MutationObserver(() => {
            if (clickRoleHeader()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            if (observer) {
                observer.disconnect();
            }
        }, 30000);
    }

    console.log(
        "PIM Role Sorter loaded",
        location.href
    );

    armWatcher();

    setInterval(() => {
        if (location.href === currentUrl) {
            return;
        }

        currentUrl = location.href;

        console.log(
            "PIM Role Sorter: location changed to",
            currentUrl
        );

        armWatcher();
    }, 500);
})();