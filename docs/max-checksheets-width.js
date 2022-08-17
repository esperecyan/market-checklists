const main = document.getElementsByTagName('main')[0];
main.style.transformOrigin = 'top left';
const observer = new ResizeObserver(function (entries) {
	console.log(entries);
	const mainComputedStyle = getComputedStyle(main);
	const maxWidth = document.body.clientWidth - Number.parseInt(mainComputedStyle.margin) * 2;
	const width = Number.parseInt(mainComputedStyle.width);
	main.style.scale = width > maxWidth ? maxWidth / width : '';
});
observer.observe(document.body);
observer.observe(main);
