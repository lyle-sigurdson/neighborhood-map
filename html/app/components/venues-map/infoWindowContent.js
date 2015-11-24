import config from 'app/app-config.json!';

/*
 * A function returning HTML suitable for info window content based on the
 * 'venue' argument
 */

export default function (venue) {
    return `
        <div class="info-window-content">
          <h3 class="info-window-content__heading">${venue.name}</h3>
          <ul class="list-bare">
            ${venue.location && venue.location.address ? `<li>${venue.location.address}</li>` : ''}
            ${venue.contact && venue.contact.formattedPhone ? `<li>${venue.contact.formattedPhone}</li>` : ''}
            <li><img class="info-window-content__logo" src="img/foursquare-icon-50x50.png" alt="Foursquare logo"> <a href="https://foursquare.com/v/${encodeURI(venue.name.replace('#', ''))}/${venue.id}?ref=${config.foursquareClientId}" target="_blank">${venue.name}</a></li>
            ${venue.contact && venue.contact.twitter ? `<li><img class="info-window-content__logo" src="img/TwitterLogo.png" alt="Twitter logo"> <a href="https://twitter.com/${venue.contact.twitter}" target="_blank">@${venue.contact.twitter}</a></li>` : ''}
            ${venue.contact && venue.contact.facebookName ? `<li><img class="info-window-content__logo" src="img/FB-f-Logo__blue_50.png" alt="Facebook logo"> <a href="https://facebook.com/${venue.contact.facebook}" target="_blank">${venue.contact.facebookName}</a></li>` : ''}
          </ul>
        </div>
    `;
}
