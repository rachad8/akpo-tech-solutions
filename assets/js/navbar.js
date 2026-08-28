

document.addEventListener(
"DOMContentLoaded",
()=>{

    const toggle =
    document.querySelector(
        ".navbar-toggler"
    );

    const menu =
    document.querySelector(
        ".navbar-menu"
    );

    if(toggle && menu){

        toggle.addEventListener(
            "click",
            ()=>{

                menu.classList.toggle(
                    "active"
                );

            }
        );

    }

});