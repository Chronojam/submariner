import 'dart:html';
import 'dart:convert';
import 'component.dart';

class LoginPage extends Component {
  LoginPage(String IdPrefix) : super(IdPrefix);

  void CreateGame(String apiEndpoint) async {
    var response = await HttpRequest.request(
      apiEndpoint+"/game/create",
      method: 'POST',
      sendData: json.encode({}),
      requestHeaders: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    );

    var gameid = json.decode(response.response)['gameid'];
    querySelector('#$this.IdPrefix-gameid').text = gameid;
    this.JoinGame(apiEndpoint);
  }

  void JoinGame(String apiEndpoint) async {
    var data = {
      'username': querySelector('#$this.IdPrefix-username'),
      'gameid': querySelector('#$this.IdPrefix-gameid'),
    };
    var response = await HttpRequest.request(
      apiEndpoint+"/game/join",
      method: 'POST',
      sendData: json.encode(data),
      requestHeaders: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    );
    if (response.status != 200) {
      querySelector('#$this.IdPrefix-error').text = json.decode(response.response)['error'];
    }
  }
}