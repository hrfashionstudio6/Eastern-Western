import './ComingSoon.css'

const ComingSoon = () => {
  return (
    <div className="coming-soon-shell">
      <picture className="coming-soon-picture">
        <source
          media="(max-width: 767px)"
          srcSet="/assets/Eastern-Western-Mobile.jpg"
        />
        <img
          src="/assets/Eastern-Western-Desktop.jpg"
          alt="Eastern Western Coming Soon"
          className="coming-soon-image"
        />
      </picture>
    </div>
  )
}

export default ComingSoon
