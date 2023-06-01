import yayJpg from '../assets/yay.jpg';

export default function HomePage() {
  return (
    <div className=' font-mono'>
      <h2>Yay! Welcome!</h2>
      <p>
        <img src={yayJpg} width="388" />
      </p>
    </div>
  );
}
