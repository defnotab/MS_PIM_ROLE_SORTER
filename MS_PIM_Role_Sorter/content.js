(function () {
    "use strict";

    const TARGET_URLS = [
        "Microsoft_Azure_PIMCommon/ActivationMenuBlade",
        "aadmigratedroles"
    ];

    const isPimPage = TARGET_URLS.every(x =>
        window.location.href.includes(x)
    );

    if (!isPimPage) {
        return;
    }

    let alreadySorted = false;

    function clickRoleHeader() {
        if (alreadySorted) {
            return;
        }

        const headers = document.querySelectorAll(".azc-grid-headerlabel");

        for (const header of headers) {
            if (header.textContent.trim() === "Role") {
                console.log("PIM Role Sorter: Clicking Role column");

                header.click();

                // Click again if needed to guarantee ascending order.
                setTimeout(() => {
                    header.click();
                }, 500);

                alreadySorted = true;
                return true;
            }
        }

        return false;
    }

    clickRoleHeader();

    const observer = new MutationObserver(() => {
        if (clickRoleHeader()) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(() => observer.disconnect(), 30000);
})();