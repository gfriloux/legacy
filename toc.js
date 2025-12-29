// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="index.html"><strong aria-hidden="true">1.</strong> Index</a></li><li class="chapter-item expanded "><a href="zfs/index.html"><strong aria-hidden="true">2.</strong> ZFS</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="zfs/histoire.html"><strong aria-hidden="true">2.1.</strong> Histoire</a></li><li class="chapter-item expanded "><a href="zfs/technical.html"><strong aria-hidden="true">2.2.</strong> Les cas pratiques</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="zfs/datasets.html"><strong aria-hidden="true">2.2.1.</strong> Datasets</a></li><li class="chapter-item expanded "><a href="zfs/snapshots.html"><strong aria-hidden="true">2.2.2.</strong> Snapshots</a></li></ol></li><li class="chapter-item expanded "><a href="zfs/outils.html"><strong aria-hidden="true">2.3.</strong> Outils</a></li></ol></li><li class="chapter-item expanded "><a href="nix/index.html"><strong aria-hidden="true">3.</strong> Nix(OS)</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="nix/histoire.html"><strong aria-hidden="true">3.1.</strong> Histoire</a></li><li class="chapter-item expanded "><a href="nix/devbox.html"><strong aria-hidden="true">3.2.</strong> devbox</a></li><li class="chapter-item expanded "><a href="nix/flakes.html"><strong aria-hidden="true">3.3.</strong> flakes</a></li><li class="chapter-item expanded "><a href="nix/direnv.html"><strong aria-hidden="true">3.4.</strong> direnv</a></li><li class="chapter-item expanded "><a href="nix/home-manager.html"><strong aria-hidden="true">3.5.</strong> home-manager</a></li></ol></li><li class="chapter-item expanded "><a href="systemd/index.html"><strong aria-hidden="true">4.</strong> Systemd</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="systemd/histoire.html"><strong aria-hidden="true">4.1.</strong> Histoire</a></li><li class="chapter-item expanded "><a href="systemd/systemctl.html"><strong aria-hidden="true">4.2.</strong> systemctl</a></li><li class="chapter-item expanded "><a href="systemd/portables.services.html"><strong aria-hidden="true">4.3.</strong> portable services</a></li><li class="chapter-item expanded "><a href="systemd/technical.html"><strong aria-hidden="true">4.4.</strong> Les cas pratiques</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="systemd/startpage.html"><strong aria-hidden="true">4.4.1.</strong> startpage</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="docker/index.html"><strong aria-hidden="true">5.</strong> Docker</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="docker/histoire.html"><strong aria-hidden="true">5.1.</strong> Histoire</a></li><li class="chapter-item expanded "><a href="docker/traefik.html"><strong aria-hidden="true">5.2.</strong> traefik</a></li><li class="chapter-item expanded "><a href="docker/watchtower.html"><strong aria-hidden="true">5.3.</strong> watchtower</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
