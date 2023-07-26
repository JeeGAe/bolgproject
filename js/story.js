window.addEventListener('load', event => {
  //테마 변경 (다크/일반)
  const mode = document.querySelector('.mode');
  const header = document.querySelector('header');
  const icons = header.querySelectorAll('.fa-solid');
  const categoryContainer = document.querySelector('.category-container');
  
  mode.addEventListener('click', event => {
    document.body.classList.toggle('dark');
    header.classList.toggle('dark');
    categoryContainer.classList.toggle('dark');

    for(const icon of icons){
      icon.classList.contains('active') ?
        icon.classList.remove('active') :
        icon.classList.add('active');
    }
  })
  //브라우저 상단으로 스크롤
  const arrowUp = document.querySelector('.footer .icons .scroll-up');
  arrowUp.addEventListener('click', event => {
    history.pushState({}, "", "/"); //URL 초기화
    scroller.setScrollPosition({top: 0, behavior: 'smooth'});
    //scroller.isScrollEnded();
  })

  const logo = document.querySelector('header .logo');
  logo.addEventListener('click', event => {
    event.preventDefault(); //a 태그 기본동작 제거
    history.pushState({}, "", "/"); //URL 초기화
    scroller.setScrollPosition({top: 0, behavior: 'smooth'});
    scroller.isScrollEnded();
  })
})