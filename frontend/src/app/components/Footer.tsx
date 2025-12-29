export function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent inline-block">
                            ミートアンドイート
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            位置情報を使って中間地点のレストランを自動提案する、<br />ログイン不要のイベント調整サービスです。
                            <br />
                            幹事の負担を減らし、みんなが集まりやすい場所で<br />楽しい時間を過ごしましょう。
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-gray-200">Menu</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-orange-400 transition-colors">トップページ</a></li>
                            <li><a href="#how-it-works" className="hover:text-orange-400 transition-colors">使い方</a></li>
                            <li><a href="#features" className="hover:text-orange-400 transition-colors">特徴</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-gray-200">Powered by</h4>
                        <ul className="space-y-2 text-xs text-gray-500">
                            <li>
                                <a href="https://mapsplatform.google.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                                    Google Maps Platform
                                </a>
                            </li>
                            <li>
                                <a href="https://webservice.recruit.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                                    Hot Pepper Gourmet
                                </a>
                            </li>
                            <li>
                                <a href="http://express.heartrails.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                                    HeartRails Express
                                </a>
                            </li>
                            <li>
                                <a href="https://nominatim.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                                    Nominatim (OSM)
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
                        <span>技育CAMPハッカソン vol.16</span>
                        <span>Team ノリノリノリノリ</span>
                    </div>
                    <div className="flex gap-6">
                        <span>Data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">OpenStreetMap</a> contributors</span>
                        <span>© 2025 Meet And Eat</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
