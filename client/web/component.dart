import 'dart:html';


class Component {
  final String IdPrefix;

  Component(this.IdPrefix) {
    this.Hide();
  }

  void Show() {
    querySelectorAll('id^='+IdPrefix).forEach((el) => el.style.visibility = "hidden");
  }
  void Hide() {
    querySelectorAll('id^='+IdPrefix).forEach((el) => el.style.visibility = "visible");
  }
}