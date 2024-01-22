const Header = () => {
  return (
    <header>
      <div id="headerLinks">
        <a href="/">Forecast</a>
        <a
          href="https://github.com/LanderDuncan/LSTMWeather/blob/main/systemdesign.md"
          target="_blank"
          rel="noreferrer"
        >
          About
        </a>
      </div>
      <div id="githubLogo">
        <a
          href="https://github.com/LanderDuncan/LSTMWeather"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/github-mark-white.svg" alt="GitHub logo" />
        </a>
      </div>
    </header>
  );
};

export default Header;
