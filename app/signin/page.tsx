import Footer from 'components/footer';
import Image from "next/image"
import SignInForm from './form';
import SvgWhiteLogo from 'public/icons/white-logo.svg';

export default function SignIn() {
	return (
		<main
			className={`relative m-auto flex h-[100vh] w-full flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-50 pl-2 pr-2 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0`}
		>
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
           <Image src={SvgWhiteLogo} alt='' width={30} height={30} className='mr-2' />
            FinanSys
          </div>
          <div className="relative z-20 mt-auto mb-4">
            <blockquote className="space-y-10">
              <p className="text-lg">
                &ldquo;A melhor maneira de se organizar adequadamente mantendo um principio básico da educação financeira.&rdquo;
              </p>
              <footer className="text-sm ">Homer Simpson</footer>
            </blockquote>
          </div>
        </div>
			<div className="z-50 m-auto flex w-[380px] flex-1 flex-col justify-center p-6 sm:w-[468px] sm:p-10">
				<SignInForm />
			</div>
			<Footer className={'absolute bottom-0'} />
		</main>
	);
}
