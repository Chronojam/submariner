load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "io_bazel_rules_go",
    urls = ["https://github.com/bazelbuild/rules_go/releases/download/0.17.0/rules_go-0.17.0.tar.gz"],
    sha256 = "492c3ac68ed9dcf527a07e6a1b2dcbf199c6bf8b35517951467ac32e421c06c1",
)
http_archive(
    name = "bazel_gazelle",
    urls = ["https://github.com/bazelbuild/bazel-gazelle/releases/download/0.16.0/bazel-gazelle-0.16.0.tar.gz"],
    sha256 = "7949fc6cc17b5b191103e97481cf8889217263acf52e00b560683413af204fcb",
)
load("@io_bazel_rules_go//go:deps.bzl", "go_rules_dependencies", "go_register_toolchains")
go_rules_dependencies()
go_register_toolchains()

load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies", "go_repository")
gazelle_dependencies()

go_repository(
    name = "com_github_gorilla_websocket",
    importpath = "github.com/gorilla/websocket",
    urls = ["https://github.com/gorilla/websocket/archive/v1.4.0.tar.gz"],
    sha256 = "2b5743c72bd0930c5a80e49c0138b5b7d27fa7c085efd0c86805cccfa7220c9d",
    type = "tar.gz",
    strip_prefix = "websocket-1.4.0",
)
go_repository(
    name = "com_github_solarlune_resolv",
    importpath = "github.com/SolarLune/resolv",
    urls = ["https://github.com/solarlune/resolv/tarball/c324bac5f69da0494c87fd43028012f2a2b2b5da"],
    sha256 = "f2c2b785d085308794d79eb1b0b1f343ee46a8a9fd98091e6e9cb1db8d450ac9",
    type = "tar.gz",
    strip_prefix = "SolarLune-resolv-c324bac",
)