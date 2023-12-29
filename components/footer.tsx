const Footer = ({ className }: { className?: String }) => {
	return (
		<footer className={`className flex h-14 w-full items-center border-t pl-6 pr-6 font-medium ${className}`}>
			<div className="xs:mb-0 flex w-full justify-center">
				<div className="flex flex-row items-center justify-between border-t border-white/5">
					<p className="text-xs ">
					 <span className="text-white"> &copy; Copyright</span>&nbsp;&nbsp;&nbsp;
					 <span className="text-gray-600">{new Date().getFullYear()}, Balkzar</span>
					</p>
					<div className="flex gap-3">
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
