const scroller = new Scroller(false)// 스크롤 객체 생성

window.addEventListener('load', event => {
  //테마 변경 (다크/일반)
  const mode = document.querySelector('.mode');
  const header = document.querySelector('header');
  const icons = header.querySelectorAll('.fa-solid');
  
  mode.addEventListener('click', event => {
    document.body.classList.toggle('dark');
    header.classList.toggle('dark');
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

  //네비게이션 메뉴 클릭시 섹션위치로 스크롤
  const sections = document.querySelectorAll('section:not(.footer)');
  const nav = document.querySelector('.navbar ul');
  // 네비게이션 메뉴 클릭한 경우
  nav.querySelectorAll('li a').forEach(anchor => {
    anchor.addEventListener('click', function(event){
      event.preventDefault();
      const section = this.getAttribute('href');
      const offsetToElementFromViewport = document.querySelector(section).getBoundingClientRect().top;
      if(!scroller.getScrollState()){
        
        history.pushState({}, '', `${section}`);

        const offsetToElementFromDocument = offsetToElementFromViewport + scroller.getScrollPosition() - header.offsetHeight - 10; // 문서 상단에 서 섹션까지의 거리
        scroller.setScrollPosition({top: offsetToElementFromDocument, behavior: 'smooth'});
        scroller.isScrollEnded();
      }
    })
  })

  let lastScrollLocation = 0;
  let sectionToMove, menulink;

  window.addEventListener('scroll', event => {
    //스크롤이 끝났는지 아닌지 확인
    scroller.isScrollEnded()
    .then(result => console.log('scroll ended!'))
    .catch(err => console.log('scrolling...'));
    //스크롤링 중에 어느정도 스크롤바가 내려가면 헤더 그림자 적용
    scroller.getScrollPosition() > header.offsetHeight ?
    header.classList.add('active') :
    header.classList.remove('active');
    // 스크롤링 중에 텍스트 애니메이션 적용
    sections.forEach(section => {
      const title = section.querySelector('.content h3');
      const paragraph = section.querySelector('.content p');
      //console.log(section.id , section.getBoundingClientRect().top);

      if(section.getBoundingClientRect().top < header.offsetHeight + 50){
        //해당 섹션이 헤더에 가까워지면 텍스트 애니메이션 적용
        title.classList.add('show');
        paragraph.classList.add('show');
        // 해당 섹션이 헤더에 가까워지면 해당 메뉴에 하이라이트 적용
        //console.log(section.id);
        nav.querySelector('a.active').classList.remove('active');
        nav.querySelector(`a[href="#${section.id}"]`).classList.add('active');
      }

      //스크롤바가 브라우저 상단에 도달하면 텍스트 애니메이션 초기화
      if(scroller.getScrollPosition() < 10){
        title.classList.remove('show');
        paragraph.classList.remove('show');
      }
    })

    if(!scroller.getScrollState()){ //조건문이 없으면 무한루프
      // 현재 화면에 보여지는 섹션에 대한 메뉴링크 (a 태그)
      menulink = nav.querySelector('a.active').closest('li');
      // 스크롤 올렸는지 내렸는지 판단
      console.log(scroller.getScrollPosition() - lastScrollLocation > 100)
      if((scroller.getScrollPosition() - lastScrollLocation) > 20){
        lastScrollLocation = scroller.getScrollPosition();
        sectionToMove = menulink.nextElementSibling?.querySelector('a');
      }else if((scroller.getScrollPosition() - lastScrollLocation) < -20){
        lastScrollLocation = scroller.getScrollPosition();
        sectionToMove = menulink.previousElementSibling?.querySelector('a');
      }
      // 스크롤링할때 이전/다은 메뉴를 자바스크립트로 클릭해주기
      console.log(sectionToMove?.getAttribute('href'))
      if(sectionToMove?.getAttribute('href') !== undefined){
        sectionToMove.click();
      }
    }
  })
})

console.log('date: ' + new Date(new Date('04 Mar 2022 12:20:30') - new Date()));